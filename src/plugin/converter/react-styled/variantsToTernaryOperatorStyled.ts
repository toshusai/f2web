import {
  convertToVariantAvairableName,
  isTextDomNode,
} from "../figmaNodeToDomNode";
import { DomNode } from "../../types/DomNode";
import { toInner } from "./stylesToStyledCss";

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
  if (!styles) return false;
  const cssObj = toInner(styles);
  if (key.startsWith("media")) {
    return optimizeCss(`${variantsToTernaryOperatorStyled(
      Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
      defaultValue
    )}
  @media screen and (${value}) {\n${indent(cssObj.css + cssObj.before, 2)}
  }`);
  }

  return `\${({$${convertToVariantAvairableName(
    key
  )}}) => $${convertToVariantAvairableName(
    key
  )} === "${value}" ? \`${optimizeCss(
    cssObj.css + cssObj.before
  )}\` : \`${variantsToTernaryOperatorStyled(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue
  )}\`}`;
}

function optimizeCss(css: string) {
  let cache: Record<string, true> = {};
  const lines = css.split("\n").map((x) => x.trim());
  lines.forEach((line, i) => {
    if (cache[line]) {
      lines[i] = "";
    } else {
      cache[line] = true;
    }
  });
  return lines.filter((x) => x !== "").join("\n");
}

function indent(str: string, depth: number) {
  return str
    .split("\n")
    .map((x) => " ".repeat(depth) + x)
    .join("\n");
}
