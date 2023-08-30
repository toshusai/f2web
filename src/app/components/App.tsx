import React, { useEffect } from "react";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { addMessageEventListener } from "./addMessageEventListener";
import { convertToCssAvairableName } from "../../../packages/examples/src/code-writer/convertToCssAvairableName";
declare const prettierPlugins: any;
declare const prettier: any;

export function App() {
  useEffect(() => {
    return addMessageEventListener("selection", (message) => {
      const { html, ctx, cssVars } = message;
      const preview = document.getElementById("preview");
      if (!preview) return;
      preview.innerHTML = html;

      const style = document.getElementById("tailwind");
      if (!style) return;
      let css = "";
      Object.keys(cssVars).forEach((theme) => {
        let themeCss = `#preview`;
        if (theme === "__default__") {
          themeCss += ` {`;
        } else {
          themeCss += `[data-theme="${theme}"] {`;
        }

        Object.keys(cssVars[theme]).forEach((key) => {
          themeCss += ` --${convertToCssAvairableName(key)}: ${
            cssVars[theme][key]
          };`;
        });
        themeCss += "}\n";
        css += themeCss;
      });
      style.innerHTML = css;

      let firstTheme = Object.keys(cssVars)[0];
      if (!firstTheme) return;
      preview.setAttribute("data-theme", firstTheme);

      const codeContent = document.getElementById("code-content");
      if (!codeContent) return;
      codeContent.textContent = html + "\n\n" + JSON.stringify(ctx, null, 2);
      hljs.highlightAll();

      tailwind.config = {
        theme: {
          extend: {
            colors: ctx.colors,
          },
        },
      };
    });
  }, []);

  return (
    <div>
      <style id="tailwind"></style>
      <div id="preview" className="p-[16px]"></div>
      <pre
        style={{
          fontSize: "10px",
          lineHeight: "10px",
        }}
      >
        <code className="language-typescript" id="code-content"></code>
      </pre>
      <Resize />
    </div>
  );
}
