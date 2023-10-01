import {
  convertToVariantAvairableName,
  isTextDomNode,
} from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import { toPascalCase } from "js-convert-case";
import { Context } from "../../types/Context";
import {
  createStyledHeader,
  stylesToStyledCss,
  toInner,
} from "./stylesToStyledCss";
import { variantsToTernaryOperator } from "../react/variantsToTernaryOperator";
import { variantsToTernaryOperatorStyled } from "./variantsToTernaryOperatorStyled";
import { nodeToTernalyOperator } from "./nodeToTernalyOperator";

export type ReactStyledContext = {
  id: number;
  cssClasses: string[];
  codeGenCtx: Context;
};

export function domNodeToReactStyledString(
  node: DomNode,
  depth = 0,
  ignoreInstance = false,
  className = false,
  _ = true,
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
  if (node.type === "NULL") {
    return "null";
  }

  const tag = `Styled${toPascalCase(node.type)}${ctx.id}`;
  if (node.styles) {
    let css = stylesToStyledCss(tag, node.styles, node.type);
    if (node.variants) {
      const obj = toInner(node.styles);
      const inner = variantsToTernaryOperatorStyled(
        node.variants,
        `${obj.css + obj.before}`
      );
      if (inner !== false) {
        css = `${inner}`;
        css = createStyledHeader(tag, node.type, css, "any");

        Object.keys(node.variants).forEach((key) => {
          const k = key.split("=")[0];
          if (k.startsWith("media")) return;
          const keyName = convertToVariantAvairableName(k);
          attrs += ` $${keyName}={props.${keyName}}`;
        });
      }
    } else {
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
    } else if (node.type === "svg") {
      return `${indent}<${tag} ${attrs}></${tag}>\n`;
    } else {
      tagJsx = `${indent}<${tag} ${attrs}>\n${children}${indent}</${tag}>\n`;
    }
  }

  if (node.variants) {
    const inner = nodeToTernalyOperator(
      node.variants,
      tagJsx,
      ignoreInstance,
      node,
      ctx
    );
    if (inner !== false && inner !== tagJsx) {
      tagJsx = `${indent}{${inner.replace(/\n/g, "")}}\n`;
    }
  }
  return tagJsx;
}
