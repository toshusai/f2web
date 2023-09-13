import { convertToVariantAvairableName } from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import { domNodeToHtml } from "./domNodeToHtml";

export function nodeToTernalyOperator(
  variants: Record<string, DomNode>,
  defaultValue: string,
  ignoreInstance,
  node: DomNode
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
  if (node.type === variantValue.type) {
    return defaultValue;
  }
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
    ignoreInstance,
    node
  )}`;
}
