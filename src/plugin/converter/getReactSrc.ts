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
export function ${ctx.name}(${contextPropsToReactPropsString(ctx.props)}) {
  return (
${jsx}  )
}
`;
}

export function getStoriesSrc(ctx: any) {
  const name = ctx.name;
  return `import type { Meta, StoryObj } from "@storybook/react";

import { ${name} } from "./${name}";

const meta = {
  component: ${name},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ${name}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    ${Object.keys(ctx.props ?? {})
      .map((key) => `${key}: ${ctx.props[key].value}`)
      .join(",\n")}
  },
};
`;
}
