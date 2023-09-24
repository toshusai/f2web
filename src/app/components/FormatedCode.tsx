import React, { useEffect } from "react";
import hljs from "highlight.js";
import * as prettier from "prettier/standalone.mjs";
import prettierPlugins from "prettier/plugins/typescript.mjs";
import htmlPlugin from "prettier/plugins/html.mjs";
import estreePlugins from "prettier/plugins/estree.mjs";
import { CodeType } from "./Preview";

export function FormatedCode(props: { src: string; type: CodeType }) {
  const codeRef = React.useRef<HTMLPreElement>(null);
  const { src } = props;
  const [formatted, setFormatted] = React.useState<string>(src);
  useEffect(() => {
    prettier
      .format(src, {
        parser: props.type === CodeType.Html ? "html" : "typescript",
        plugins: [prettierPlugins, estreePlugins, htmlPlugin],
      })
      .then((formatted) => {
        if (formatted === src) return;
        setFormatted(formatted);
      })
      .catch((_e: any) => {
        console.error(_e);
        setFormatted(src);
      });
  }, [prettierPlugins, estreePlugins, src]);

  useEffect(() => {
    if (!codeRef.current) return;
    if (props.type === CodeType.Html) {
      codeRef.current.className = "language-html";
    } else {
      codeRef.current.className = "language-typescript";
    }

    hljs.highlightAll();
  }, [formatted]);

  return (
    <pre
      style={{
        fontSize: "10px",
        lineHeight: "10px",
        // 24px is the height of the header
        height: "calc(100vh - 24px)",
        overflow: "auto",
      }}
    >
      <code className="language-typescript" ref={codeRef}>
        {formatted}
      </code>
    </pre>
  );
}
