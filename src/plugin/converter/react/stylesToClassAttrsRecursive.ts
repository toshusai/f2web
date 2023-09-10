import { DomNode } from "../DomNode";
import { AttrType } from "../AttrValue";
import { isTextDomNode } from "../figmaNodeToDomNode";
import { cssPropsToClasses } from "../tailwind/cssPropsToClasses";

export function stylesToClassAttrsRecursive(domNode: DomNode) {
  if (isTextDomNode(domNode)) {
    if (domNode.valueType === "variable") {
      domNode.value = `{props.${domNode.value}}`;
    }
    return;
  }
  if (domNode.styles) {
    if (!domNode.attrs) {
      domNode.attrs = {};
    }
    domNode.attrs.class = {
      type: AttrType.VALUE,
      value: cssPropsToClasses(domNode.styles).join(" "),
    };
    Object.keys(domNode.attrs).forEach((key) => {
      domNode.attrs = domNode.attrs ?? {};
      if (domNode.attrs[key].type === AttrType.VARIABLE) {
        domNode.attrs[key].value = `props.${domNode.attrs[key].value}`;
      }
    });
  }
  if (domNode.children) {
    domNode.children.forEach((child) => stylesToClassAttrsRecursive(child));
  }
}
