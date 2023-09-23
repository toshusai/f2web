import React, { useEffect } from "react";
import hljs from "highlight.js";
import { getReactSrc } from "../../plugin/converter/react/getReactSrc";
import { compareTreeNode } from "../../plugin/converter/compareTreeNode";
import { toCssStyleText } from "../../plugin/converter/html-css/toCssStyleText";
import { stylesToClassAttrsRecursive } from "../../plugin/converter/react/stylesToClassAttrsRecursive";
import { getReactStyledSrc } from "../../plugin/converter/react-styled/getReactStyledSrc";
import { prettier, prettierPlugins } from "./App";
import { Tabs } from "./Tabs";

export function Preview(props: { message: any }) {
  const [option, setOption] = React.useState<"tailwind" | "styled">("tailwind");
  const { message } = props;
  // some methods will mutate the message so we need to clone it
  const { html, ctx, domNodes } = JSON.parse(JSON.stringify(message));
  const [error, setError] = React.useState<string>("");

  let html2 = html;
  if (ctx.images) {
    Object.keys(ctx.images).forEach((key) => {
      const uint8 = ctx.images[key];
      const url = URL.createObjectURL(new Blob([uint8], { type: "image/png" }));
      html2 = html2.replace(new RegExp(key, "g"), url);
    });
  }
  const styleInnerHtml = toCssStyleText(ctx.colors);

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

  let tailwindConfigColors = {};
  Object.keys(ctx.colors).forEach((key) => {
    tailwindConfigColors[ctx.colors[key].id] = `var(--${ctx.colors[key].id})`;
  });

  let formatted = src;
  try {
    formatted = prettier.format(src, {
      parser: "typescript",
      plugins: prettierPlugins,
    });
  } catch (e: any) {
    const internalError = `Internal error: code generation failed. Please report this issue on`;
    if (error != internalError) {
      setError(internalError);
    }
  }

  const codeRef = React.useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (!codeRef.current) return;
    hljs.highlightAll();

    tailwind.config = {
      theme: {
        extend: {
          colors: ctx.colors,
        },
      },
    };
  }, [option]);

  return (
    <>
      <div className="text-red-500">{error}</div>
      <style
        id="tailwind"
        dangerouslySetInnerHTML={{
          __html: styleInnerHtml,
        }}
      ></style>
      <div
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%)",
          borderTop: "1px solid #E0E0E0",
          borderBottom: "1px solid #E0E0E0",
        }}
        dangerouslySetInnerHTML={{
          __html: html2,
        }}
      ></div>
      <Tabs
        items={[
          {
            label: "Tailwind",
            value: "tailwind",
          },
          {
            label: "Styled",
            value: "styled",
          },
        ]}
        active={option}
        onClick={(value) => {
          setOption(value as "tailwind" | "styled");
        }}
      />
      <pre
        style={{
          fontSize: "10px",
          lineHeight: "10px",
        }}
      >
        <code className="language-typescript" ref={codeRef}>
          {formatted}
        </code>
      </pre>
    </>
  );
}
