import { convertToCssAvairableName } from "./convertToCssAvairableName";
import { DomMeta } from "../types/DomMeta";

export function parseDomName(name: string): {
  name: string;
  meta: DomMeta;
} {
  const sp = name.split("#");

  const domName = sp[0];
  const meta = parseTagAndAttrs(sp.length > 1 ? sp[1] : name);

  return {
    name: convertToCssAvairableName(domName),
    meta,
  };
}

/**
 * <tag attr1="value1" attr2="value2" />
 * @param tag
 */
function parseTagAndAttrs(str: string) {
  let tag = "div";
  const reg = /<([a-zA-Z0-9-]+)(\s|>)/;
  const result = str.match(reg);
  if (result) {
    tag = result[1];
  }
  const reg2 = /([a-zA-Z0-9-]+)="([^"]+)"/g;
  const attrs: { key: string; value: string }[] = [];
  let match;
  while ((match = reg2.exec(str)) !== null) {
    attrs.push({
      key: match[1],
      value: match[2],
    });
  }
  return {
    tagName: tag,
    attributes: attrs,
  };
}
