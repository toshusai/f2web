import {
  convertToVariantAvairableName,
  isTextDomNode,
} from "./figmaNodeToDomNode";
import { DomNode } from "./DomNode";
import { AttrValue, Variants } from "./AttrValue";
import { toCamelCase } from "js-convert-case";

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
      if (className) {
        key = toCamelCase(key);
      }
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
            const newValue = nodeToMediaQeurys(
              value.variants,
              value.value,
              ignoreInstance
            );
            if (newValue.length !== 0) {
              value.value = newValue.join(" ");
              return `className="${newValue.join(" ")}"`;
            }

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
    tagJsx = `${indent}<${node.type} ${attrs}></${node.type}>\n`;
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
    tagJsx = `${indent}<${node.type} ${attrs}>\n${children}${indent}</${node.type}>\n`;
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

function nodeToMediaQeurys(
  variants: Record<string, AttrValue>,
  defaultValue: string,
  ignoreInstance
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return [];
  }
  const key = keys[0].split("=")[0];
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]];
  let final = defaultValue.split(" ");
  if (key.startsWith("@")) {
    const variantClasses = variantValue.value.split(" ");

    const plusDiff = variantClasses.filter((x) => !final.includes(x));
    const minusDiff = final.filter((x) => !variantClasses.includes(x));
    minusDiff.forEach((x) => {
      if (x === "hidden") {
        final.push(`${value}:flex`);
      }
    });

    final = final;
  }
  final = [
    ...final,
    ...nodeToMediaQeurys(
      Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
      defaultValue,
      ignoreInstance
    ),
  ];
  return final;
}

function getClasses(node: DomNode) {
  if (isTextDomNode(node)) return [];
  if (!node.attrs) return [];
  const classes = node.attrs["class"];
  if (!classes) return [];
  return classes.value.split(" ");
}

function nodeToTernalyOperator(
  variants: Record<string, DomNode>,
  defaultValue: string,
  ignoreInstance
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return defaultValue;
  }
  const key = keys[0].split("=")[0];
  if (key.startsWith("@")) {
    return defaultValue;
  }
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]];
  return `props.${convertToVariantAvairableName(
    key
  )} === "${value}" ? ${domNodeToHtml(
    variantValue,
    0,
    ignoreInstance,
    true
  )} : ${nodeToTernalyOperator(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue,
    ignoreInstance
  )}`;
}

/**
 * { "key=value": { type: "value", value: "valriantValue" } } => key={props.key==="value" ? "valriantValue" : "defaultValue"}
 */
function variantsToTernaryOperator(
  variants: Record<string, AttrValue>,
  defaultValue: string
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return defaultValue;
  }
  const key = keys[0].split("=")[0];
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]].value;
  return `props.${convertToVariantAvairableName(
    key
  )} === "${value}" ? "${variantValue}" : ${variantsToTernaryOperator(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue
  )}`;
}
