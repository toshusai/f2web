import { toCamelCase } from "js-convert-case";
import { findAllImageHashes } from "./findAllImageHashes";

export function componentSetToStoriesTsx(node: ComponentSetNode) {
  const defs = node.componentPropertyDefinitions;
  const name = node.name ?? "Component";
  const imageHashes = findAllImageHashes(node);
  const src = `
  import type { Meta, StoryObj } from "@storybook/react";

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
    ${Object.entries(defs).map(([key, value]) => {
      if (value.type === "TEXT") {
        return `${toCamelCase(key.split("#")[0])}: '${value.defaultValue}'`;
      }
    })}
    ${imageHashes
      .map((hash) => `$${hash}: 'https://picsum.photos/seed/${hash}/600/400'`)
      .join(",\n")}
  },
};
`;
  return src;
}
