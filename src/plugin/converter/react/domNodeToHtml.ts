import { isTextDomNode } from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import { nodeToTernalyOperator } from "./nodeToTernalyOperator";
import { variantsToTernaryOperator } from "./variantsToTernaryOperator";

export function domNodeToHtml(
  node: DomNode,
  depth = 0,
  ignoreInstance = false,
  className = false,
  root = true
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
        if (root) {
          if (value.variants) {
            return `className={props.className ?? (${variantsToTernaryOperator(
              value.variants,
              `"${value.value}"`
            )})}`;
          }
          return `className={props.className ?? "${value.value}"}`;
        } else {
          if (value.variants) {
            return `className={${variantsToTernaryOperator(
              value.variants,
              `"${value.value}"`
            )}}`;
          }
          return `className="${value.value}"`;
        }
      }
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
        return `${key}={${value.value}}`;
      } else if (value.type === "value") {
        return `${key}="${value.value}"`;
      }
      return "";
    })
    .join(" ")
    .replace(/ +/g, " ");

  let tagJsx = "";
  if (node.children === undefined) {
    tagJsx = `${indent}<${node.type} ${attrs} />\n`;
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
        domNodeToHtml(child, depth + 1, ignoreInstance, className, false)
      )
      .join("");
    if (node.type === "img") {
      tagJsx = `${indent}<${node.type} ${attrs} />\n`;
    } else {
      tagJsx = `${indent}<${node.type} ${attrs}>\n${children}${indent}</${node.type}>\n`;
    }
  }

  if (node.variants) {
    tagJsx = `${indent}{${nodeToTernalyOperator(
      node.variants,
      tagJsx,
      ignoreInstance
    ).replace(/\n/g, "")}}\n`;
  }
  return tagJsx;
}
