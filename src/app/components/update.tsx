import hljs from "highlight.js";
import { getReactSrc } from "../../plugin/converter/react/getReactSrc";
import { getStoriesSrc } from "../../plugin/converter/react/getStoriesSrc";
import { compareTreeNode } from "../../plugin/converter/compareTreeNode";
import { toCssStyleText } from "../../plugin/converter/html-css/toCssStyleText";
import { stylesToClassAttrsRecursive } from "../../plugin/converter/react/stylesToClassAttrsRecursive";
import { getReactStyledSrc } from "../../plugin/converter/react-styled/getReactStyledSrc";
import { prettier, prettierPlugins, post } from "./App";

export function update(
  message: any,
  option: "tailwind" | "styled" = "tailwind"
) {
  const { html, ctx, domNodes } = message;
  const preview = document.getElementById("preview");
  if (!preview) return;

  let html2 = html;
  if (ctx.images) {
    Object.keys(ctx.images).forEach((key) => {
      const uint8 = ctx.images[key];
      const url = URL.createObjectURL(new Blob([uint8], { type: "image/png" }));
      html2 = html2.replace(new RegExp(key, "g"), url);
    });
  }
  preview.innerHTML = html2;
  const style = document.getElementById("tailwind");
  if (!style) return;
  style.innerHTML = toCssStyleText(ctx.colors);

  const codeContent = document.getElementById("code-content");
  if (!codeContent) return;
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
  const formatted = prettier.format(src, {
    parser: "typescript",
    plugins: prettierPlugins,
  });
  post("/api/v1/create", {
    src: formatted,
    name: ctx.name,
    stories: prettier.format(stories, {
      parser: "typescript",
      plugins: prettierPlugins,
    }),
    colorsCss,
    tailwindColors,
  });
  codeContent.textContent = formatted;
  hljs.highlightAll();

  tailwind.config = {
    theme: {
      extend: {
        colors: ctx.colors,
      },
    },
  };
}
