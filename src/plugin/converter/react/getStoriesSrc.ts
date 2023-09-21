import { Context } from "../../types/Context";

export function getStoriesSrc(ctx: Context) {
  const name = ctx.name;
  return `import type { Meta, StoryObj } from "@storybook/react";

import { ${name} } from ".";

const meta = {
  component: ${name},
  parameters: {
    layout: "${ctx.storyLayout ?? "centered"}",
  },
} satisfies Meta<typeof ${name}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    ${Object.keys(ctx.props ?? {})
      .map((key) => {
        if (!ctx.props) return "";
        const type = ctx.props[key].type;
        if (type.type === "native") {
          return `${key}: "${ctx.props[key].defaultValue}"`;
        } else if (type.type === "INSTANCE") {
          return `${key}: <div>props.${key}</div>`;
        } else if (type.type === "union") {
          const defaultValue = ctx.props[key].defaultValue;
          if (!defaultValue) return "";
          return `${key}: ${defaultValue}`;
        } else if (type.type === "typeof") {
          const defaultValue = ctx.props[key].defaultValue;
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
