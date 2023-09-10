import { DomNode } from "../types/DomNode";
import { isMixed } from "../utils/isMixed";
import { IDomNode } from "../types/IDomNode";

export function domToDomNode(node: VectorNode, dom: IDomNode): DomNode | null {
  if (!dom.childNodes) return null;
  const children = dom.childNodes
    .map((child) => domToDomNode(node, child))
    .filter((x) => x !== null) as DomNode[];
  const attrs: any = {};
  dom.attributes?.forEach((attr: any) => {
    if (attr.name === "fill") {
      if (!isMixed(node.fills)) {
        attrs["fill"] = "currentColor";
        return;
      }
    }
    attrs[attr.name] = attr.value;
  });
  return {
    type: dom.nodeName,
    attrs,
    children,
  };
}
