import { DomNode } from "../../types/DomNode";
import { isTextDomNode } from "../figmaNodeToDomNode";
import { HtmlCssContext } from "./HtmlCssContext";
import { stylesToCss } from "./stylesToCss";

function handleVariantStlye(
  variants: Record<string, DomNode>,
  defaultValue: string,
  ctx: HtmlCssContext
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return defaultValue;
  }
  const key = keys[0].split("=")[0];
  if (key.startsWith("media")) {
    const value = keys[0].split("=")[1];
    const variantValue = variants[keys[0]];
    if (isTextDomNode(variantValue))
      throw new Error("variant value should be node");
    if (variantValue.styles) {
      const media = `@media screen and (${value}) {\n${stylesToCss(
        `_${ctx.id}`,
        variantValue.styles
      )}}`;
      ctx.cssClasses.push(media);
    }
    return handleVariantStlye(
      Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
      defaultValue,
      ctx
    );
  }
}

export function domNodeToHtmlCss(
  node: DomNode,
  depth = 0,
  ctx: HtmlCssContext
): string {
  const indent = "  ".repeat(depth);
  if (isTextDomNode(node)) {
    if (typeof node.value === "string") {
      return `${indent}${node.value}\n`;
    } else {
      return `${indent}{${node.value}}\n`;
    }
  }

  ctx.id++;
  if (node.styles) {
    ctx.cssClasses.push(stylesToCss(`_${ctx.id}`, node.styles ?? {}));
  }
  if (node.variants) {
    handleVariantStlye(node.variants, "", ctx);
  }

  let attrs = Object.entries({
    ...node.attrs,
    class: {
      type: "value",
      value: `_${ctx.id}`,
    },
  })
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}="${value}"`;
      } else if (value.type === "variable") {
        return `${key}={${value.value}}`;
      } else if (value.type === "value") {
        return `${key}="${value.value}"`;
      }
      return "";
    })
    .filter((x) => x !== "");

  const children = node.children
    ?.map((x) => domNodeToHtmlCss(x, depth + 1, ctx))
    .join("");

  if (node.type === "img") {
    if (ctx.isPreview) {
      attrs = attrs.map((x) => {
        if (x.startsWith("src=")) {
          return `src="https://via.placeholder.com/150"`;
        }
        return x;
      });
    }
    return `${indent}<${node.type} ${attrs.join(" ")} />\n`;
  }

  const tagName = node.type;
  return `${indent}<${tagName} ${attrs.join(
    " "
  )}>\n${children}${indent}</${tagName}>\n`;
}
