import { isTextDomNode } from "./figmaNodeToDomNode";
import { DomNode } from "./DomNode";

export function domNodeToHtml(
  node: DomNode,
  depth = 0,
  ignoreInstance = false,
  className = false
): string {
  const indent = "  ".repeat(depth);
  if (isTextDomNode(node)) {
    if (typeof node.value === "string") {
      return `${indent}${node.value}\n`;
    } else {
      return `${indent}{${node.value}}\n`;
    }
  }

  const attrs = Object.entries(node.attrs ?? {})
    .map(([key, value]) => {
      if (className && key === "class") {
        return `className="${value}"`;
      }
      if (typeof value === "string") {
        return `${key}="${value}"`;
      } else if (value.type === "variable") {
        if (ignoreInstance) {
          return `${key}="${value}"`;
        }
        return `${key}={${value.value}}`;
      }
      return "";
    })
    .join(" ")
    .replace(/ +/g, " ");
  if (node.children === undefined) {
    return `${indent}<${node.type} ${attrs}></${node.type}>\n`;
  }
  const children = node.children
    ?.map((child) => domNodeToHtml(child, depth + 1))
    .join("");
  return `${indent}<${node.type} ${attrs}>\n${children}${indent}</${node.type}>\n`;
}
