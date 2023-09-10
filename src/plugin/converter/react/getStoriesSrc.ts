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
        if (ctx.props[key].type.type === "native") {
          return `${key}: "${ctx.props[key].defaultValue}"`;
        } else if (ctx.props[key].type.type === "INSTANCE") {
          return `${key}: <div className="rounded-[4px] bg-gradient-to-br from-red-500 to-blue-500 p-[8px] text-white">props.${key}</div>`;
        } else if (ctx.props[key].type.type === "union") {
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
