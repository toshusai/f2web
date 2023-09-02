import { Context } from "./figmaNodeToDomNode";


export function getStoriesSrc(ctx: Context) {
  const name = ctx.name;
  return `import type { Meta, StoryObj } from "@storybook/react";

import { ${name} } from ".";

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
      .map((key) => {
        if (!ctx.props) return "";
        if (ctx.props[key].type === "string") {
          return `${key}: "${ctx.props[key].defaultValue}"`;
        } else if (ctx.props[key].type === "INSTANCE") {
          return `${key}: "${ctx.props[key].defaultValue}"`;
        } else if (Array.isArray(ctx.props[key].type)) {
          const defaultValue = ctx.props[key].defaultValue;
          if (!defaultValue) return "";
          return `${key}: ${defaultValue}`;
        }
        return ``;
      })
      .filter((x) => x !== "")
      .join(",\n")}
  },
};
`;
}
