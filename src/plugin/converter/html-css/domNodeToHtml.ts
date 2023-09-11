import { DomNode } from "../../types/DomNode";
import { isTextDomNode } from "../figmaNodeToDomNode";
import { HtmlCssContext } from "./HtmlCssContext";
import { stylesToCss } from "./stylesToCss";

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

  const attrs = Object.entries({
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

  if (node.name === "img") {
    return `${indent}<${node.name} ${attrs.join(" ")} />\n`;
  }

  const tagName = node.type;
  return `${indent}<${tagName} ${attrs.join(
    " "
  )}>\n${children}${indent}</${tagName}>\n`;
}
