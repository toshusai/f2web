import {
  convertToVariantAvairableName,
  isTextDomNode,
} from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import { nodeToTernalyOperator } from "../react/nodeToTernalyOperator";
import { toPascalCase } from "js-convert-case";
import { Context } from "../../types/Context";
import { contextPropsToReactPropsString } from "../react/contextPropsToReactPropsString";
import {
  createStyledHeader,
  stylesToStyledCss,
  toInner,
} from "./stylesToStyledCss";
import { stylesToCssString } from "./stylesToCssString";
import { variantsToTernaryOperator } from "../react/variantsToTernaryOperator";

export type ReactStyledContext = {
  id: number;
  cssClasses: string[];
};

export function getReactStyledSrc(node: DomNode, ctx: Context) {
  const rootCtx: ReactStyledContext = {
    id: 0,
    cssClasses: [],
  };
  const styledJsx = domNodeToReactStyledString(
    node,
    0,
    false,
    false,
    true,
    rootCtx
  );
  return `import React from "react";
import styled from "styled-components";
${Object.keys(ctx.dependencies ?? {})
  .filter((key) => styledJsx.includes(`<Styled${key}`))
  .map((key) => {
    return `import { ${key} } from "../${key}";\n`;
  })
  .join("")}
export function ${ctx.name}(${contextPropsToReactPropsString({
    ...ctx.props,
    className: {
      type: {
        type: "native",
        value: "string",
        optional: true,
      },
      defaultValue: '""',
    },
  })}) {
  return (
${styledJsx}  
)
}

${rootCtx.cssClasses.join("\n")}
`;
}

export function variantsToTernaryOperatorStyled(
  variants: Record<string, DomNode>,
  defaultValue: string
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return defaultValue;
  }

  const key = keys[0].split("=")[0];
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]];
  if (isTextDomNode(variantValue))
    throw new Error("variant value should be node");
  const styles = variantValue.styles;
  if (!styles) return defaultValue;
  const cssObj = toInner(styles);
  return `\${({$${convertToVariantAvairableName(
    key
  )}}) => $${convertToVariantAvairableName(key)} === "${value}" ? \`${
    cssObj.css + cssObj.before
  }\` : ${variantsToTernaryOperatorStyled(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue
  )}}`;
}

export function domNodeToReactStyledString(
  node: DomNode,
  depth = 0,
  ignoreInstance = false,
  className = false,
  _= true,
  ctx: ReactStyledContext
): string {
  const indent = "  ".repeat(depth);
  ctx.id++;
  if (isTextDomNode(node)) {
    if (node.valueType === "string") {
      return `${indent}${node.value}\n`;
    } else {
      return `${indent}{props.${node.value}}\n`;
    }
  }

  let attrs = Object.entries(node.attrs ?? {})
    .map(([key, value]) => {
      if (value.variants) {
        return `${key}={${variantsToTernaryOperator(
          value.variants,
          `"${value.value}"`
        )}}`;
      }
      if (typeof value === "string") {
        return `${key}="${value}"`;
      } else if (value.type === "variable") {
        if (ignoreInstance) {
          return `${key}="${value}"`;
        }
        return `${key}={props.${value.value}}`;
      } else if (value.type === "value") {
        return `${key}="${value.value}"`;
      }
      return "";
    })
    .join(" ")
    .replace(/ +/g, " ");

  let tagJsx = "";
  const tag = `Styled${toPascalCase(node.type)}${ctx.id}`;
  if (node.styles) {
    let css = stylesToStyledCss(tag, node.styles, node.type);
    if (node.variants) {
      const obj = toInner(node.styles);
      css = `${variantsToTernaryOperatorStyled(
        node.variants,
        `\`${obj.css + obj.before}\``
      )}`;
      css = createStyledHeader(tag, node.type, css, "any");

      Object.keys(node.variants).forEach((key) => {
        const k = key.split("=")[0];
        const keyName = convertToVariantAvairableName(k);
        attrs += ` $${keyName}={props.${keyName}}`;
      });
    }

    ctx.cssClasses.push(css);
  }

  if (node.children === undefined) {
    tagJsx = `${indent}<${tag} ${attrs} />\n`;
    if (node.type === "NULL") {
      if (ignoreInstance) {
        tagJsx = "";
      } else {
        tagJsx = `<></>`;
      }
    }
  } else {
    const children = node.children
      ?.map((child) =>
        domNodeToReactStyledString(
          child,
          depth + 1,
          ignoreInstance,
          className,
          false,
          ctx
        )
      )
      .join("");
    if (node.type === "img") {
      tagJsx = `${indent}<${tag} ${attrs} />\n`;
    } else {
      tagJsx = `${indent}<${tag} ${attrs}>\n${children}${indent}</${tag}>\n`;
    }
  }

  // if (node.variants) {
  //   tagJsx = `${indent}{${nodeToTernalyOperator(
  //     node.variants,
  //     tagJsx,
  //     ignoreInstance
  //   ).replace(/\n/g, "")}}\n`;
  // }
  return tagJsx;
}
