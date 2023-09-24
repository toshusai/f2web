import { getReactSrc } from "../../plugin/converter/react/getReactSrc";
import { getStoriesSrc } from "../../plugin/converter/react/getStoriesSrc";
import { compareTreeNode } from "../../plugin/converter/compareTreeNode";
import { toCssStyleText } from "../../plugin/converter/html-css/toCssStyleText";
import { stylesToClassAttrsRecursive } from "../../plugin/converter/react/stylesToClassAttrsRecursive";
import { getReactStyledSrc } from "../../plugin/converter/react-styled/getReactStyledSrc";
import { post } from "./App";
import * as prettier from "prettier/standalone.mjs";
import prettierPlugins from "prettier/plugins/typescript.mjs";
import estreePlugins from "prettier/plugins/estree.mjs";

export async function update(
  message: any,
  option: "tailwind" | "styled" = "tailwind"
) {
  const { ctx, domNodes } = message;

  const domNode = domNodes[0];
  if (option === "tailwind") {
    domNodes.forEach((x) => {
      stylesToClassAttrsRecursive(x);
    });
  }
  domNodes.forEach((domNode, i) => {
    if (i === 0) return;
    compareTreeNode(domNodes[0], domNode, domNode.name);
  });

  const src =
    option === "tailwind"
      ? getReactSrc(domNode, ctx)
      : getReactStyledSrc(domNode, ctx);

  const stories = getStoriesSrc(ctx);
  const colorsCss = toCssStyleText(ctx.colors);
  let tailwindConfigColors = {};
  Object.keys(ctx.colors).forEach((key) => {
    tailwindConfigColors[ctx.colors[key].id] = `var(--${ctx.colors[key].id})`;
  });
  const tailwindColors = `export default ${JSON.stringify(
    tailwindConfigColors,
    null,
    2
  )}`;
  const formatted = await prettier.format(src, {
    parser: "typescript",
    plugins: [prettierPlugins, estreePlugins],
  });
  post("/api/v1/create", {
    src: formatted,
    name: ctx.name,
    stories: await prettier.format(stories, {
      parser: "typescript",
      plugins: [prettierPlugins, estreePlugins],
    }),
    colorsCss,
    tailwindColors,
  });
}
