import { convertToVariantAvairableName } from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import {
  ReactStyledContext,
  domNodeToReactStyledString,
} from "./domNodeToHtml";

export function nodeToTernalyOperator(
  variants: Record<string, DomNode>,
  defaultValue: string,
  ignoreInstance,
  node: DomNode,
  ctx: ReactStyledContext
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return defaultValue;
  }
  const key = keys[0].split("=")[0];
  if (key.startsWith("media")) {
    return nodeToTernalyOperator(
      Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
      defaultValue,
      ignoreInstance,
      node,
      ctx
    );
  }

  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]];
  if (node.type === variantValue.type) {
    return defaultValue;
  }

  const variableKey = convertToVariantAvairableName(key);
  const type = ctx.codeGenCtx.props![variableKey].type;

  return `props.${convertToVariantAvairableName(key)} === ${
    type.type === "native" && type.value === "boolean" ? value : `"${value}"`
  } ? ${domNodeToReactStyledString(
    variantValue,
    0,
    ignoreInstance,
    true,
    false,
    ctx
  )} : ${nodeToTernalyOperator(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue,
    ignoreInstance,
    node,
    ctx
  )}`;
}
