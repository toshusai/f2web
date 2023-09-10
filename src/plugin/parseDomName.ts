import { convertToCssAvairableName } from "./converter/figmaNodeToDomNode";
import { parseTagAndAttrs } from "./parseTagAndAttrs";
import { DomMeta } from "./DomMeta";


export function parseDomName(name: string): {
  name: string;
  meta: DomMeta;
} {
  const sp = name.split("#");

  const domName = sp[0];
  return {
    name: convertToCssAvairableName(domName),
    meta: parseTagAndAttrs(name),
  };
}
