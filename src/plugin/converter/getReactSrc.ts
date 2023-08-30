import { domNodeToHtml } from "./domNodeToHtml";
import { DomNode } from "./DomNode";
import { contextPropsToReactPropsString } from "./contextPropsToReactPropsString";

export function getReactSrc(node: DomNode, ctx: any) {
  const jsx = domNodeToHtml(node, 2, false, true);

  return `import React from "react";
${Object.keys(ctx.dependencies ?? {})
  .map((key) => {
    return `import { ${key} } from "./${key}";\n`;
  })
  .join("")}
export function ${"Component"}(${contextPropsToReactPropsString(ctx.props)}) {
  return (
${jsx}  )
}
`;
}