import { domNodeToHtml } from "./domNodeToHtml";
import { DomNode } from "../../types/DomNode";
import { contextPropsToReactPropsString } from "./contextPropsToReactPropsString";
import { Context } from "../../types/Context";

export function getReactSrc(node: DomNode, ctx: Context) {
  const jsx = domNodeToHtml(node, 2, false, true);

  return `import React from "react";
${Object.keys(ctx.dependencies ?? {})
  .filter((key) => jsx.includes(`<${key}`))
  .map((key) => {
    return `import { ${key} } from "../${key}";\n`;
  })
  .join("")}
export function ${ctx.name}(${contextPropsToReactPropsString({
    ...ctx.props,
    className: {
      type: {
        type: "native",
        value: "string",
        optional: true,
      },
      defaultValue: '""',
    },
  })}) {
  return (
${jsx}  )
}
`;
}
