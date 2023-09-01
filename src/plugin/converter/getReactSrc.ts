import { domNodeToHtml } from "./domNodeToHtml";
import { DomNode } from "./DomNode";
import { contextPropsToReactPropsString } from "./contextPropsToReactPropsString";
import { isTextDomNode } from "./figmaNodeToDomNode";

export function getReactSrc(node: DomNode, ctx: any) {
  const jsx = domNodeToHtml(node, 2, false, true);

  return `import React from "react";
${Object.keys(ctx.dependencies ?? {})
  .map((key) => {
    return `import { ${key} } from "./${key}";\n`;
  })
  .join("")}
export function ${ctx.name}(${contextPropsToReactPropsString({
    ...ctx.props,
    className: { type: "?string", defaultValue: '""' },
  })}) {
  return (
${jsx}  )
}
`;
}

export function compareTreeNode(
  defaultNode: DomNode,
  variableNode: DomNode,
  modeName: string
) {
  if (defaultNode.type !== variableNode.type) {
    throw new Error(
      `type is different. defaultNode: ${defaultNode.type}, variableNode: ${variableNode.type}`
    );
  }
  if (isTextDomNode(defaultNode) && isTextDomNode(variableNode)) {
    return;
  }

  if ("attrs" in defaultNode && "attrs" in variableNode) {
    // if(defaultNode.attrs && variableNode.attrs) {
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

/**


<div>
  {props.Device === 'GE600' ? <IconButton /> : null}
</div>

 */
