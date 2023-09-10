import { DomNode } from "../types/DomNode";
import { isTextDomNode } from "./figmaNodeToDomNode";

export function compareTreeNode(
  defaultNode: DomNode,
  variableNode: DomNode,
  modeName: string
) {
  if (isTextDomNode(defaultNode) || isTextDomNode(variableNode)) {
    return;
  }
  if (defaultNode.type !== variableNode.type) {
    // throw new Error(
    //   `type is different. defaultNode: ${defaultNode.type}, variableNode: ${variableNode.type}`
    // );
    defaultNode.variants = defaultNode.variants ?? {};
    defaultNode.variants[modeName] = variableNode;
    return;
  }

  if ("attrs" in defaultNode && "attrs" in variableNode) {
    if (defaultNode.attrs && variableNode.attrs) {
      for (const key in defaultNode.attrs) {
        if (key in variableNode.attrs) {
          if (defaultNode.attrs[key].type !== variableNode.attrs[key].type) {
            // throw new Error(
            //   `attrs is different. key: ${key}, defaultNode: ${JSON.stringify(
            //     defaultNode.attrs[key]
            //   )}, variableNode: ${JSON.stringify(variableNode.attrs[key])}`
            // );
          } else {
            if (
              defaultNode.attrs[key].value === variableNode.attrs[key].value
            ) {
              continue;
            }
            const defaultAttr = defaultNode.attrs[key];
            defaultAttr.variants = defaultAttr.variants ?? {};
            defaultAttr.variants[modeName] = variableNode.attrs[key];
          }
        } else {
          throw new Error(
            `attrs is different. key: ${key}, defaultNode: ${JSON.stringify(
              defaultNode.attrs[key]
            )}, variableNode: ${JSON.stringify(variableNode.attrs[key])}`
          );
        }
      }
    }
  }

  if ("children" in defaultNode && "children" in variableNode) {
    if (!defaultNode.children) throw new Error("defaultNode.children is null");
    if (!variableNode.children)
      throw new Error("variableNode.children is null");
    if (defaultNode.children.length !== variableNode.children.length) {
      throw new Error(
        `children length is different. defaultNode: ${defaultNode.children.length}, variableNode: ${variableNode.children.length}`
      );
    }
    for (let i = 0; i < defaultNode.children.length; i++) {
      compareTreeNode(
        defaultNode.children[i],
        variableNode.children[i],
        modeName
      );
    }
  }
}
