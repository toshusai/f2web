import React, { useEffect } from "react";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { addMessageEventListener } from "../addMessageEventListener";
import { getReactSrc } from "../../plugin/converter/getReactSrc";
import { convertToCssAvairableName } from "../../plugin/converter/figmaNodeToDomNode";

declare const prettierPlugins: any;
declare const prettier: any;

function cssVarsToCssText(cssVars: any) {
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
  return css;
}

export function App() {
  useEffect(() => {
    return addMessageEventListener("selection", (message) => {
      const { html, ctx, cssVars, domNode } = message;
      const preview = document.getElementById("preview");
      if (!preview) return;

      let html2 = html;
      if (ctx.images) {
        Object.keys(ctx.images).forEach((key) => {
          const uint8 = ctx.images[key];
          const url = URL.createObjectURL(
            new Blob([uint8], { type: "image/png" })
          );
          html2 = html2.replace(new RegExp(key, "g"), url);
        });
      }
      preview.innerHTML = html2;

      const style = document.getElementById("tailwind");
      if (!style) return;
      style.innerHTML = cssVarsToCssText(cssVars);

      let firstTheme = Object.keys(cssVars)[0];
      if (!firstTheme) return;
      preview.setAttribute("data-theme", firstTheme);

      const codeContent = document.getElementById("code-content");
      if (!codeContent) return;
      codeContent.textContent = getReactSrc(domNode, ctx);
      hljs.highlightAll();

      tailwind.config = {
        theme: {
          extend: {
            colors: ctx.colors,
          },
        },
      };

      requestAnimationFrame(() => {
        const rect = preview.firstElementChild?.getBoundingClientRect();
        if (!rect) return;
        const bodyRect = document.body.getBoundingClientRect();
        const size = {
          w: Math.round(rect.width) + 32,
          h: bodyRect.height,
        };
        parent.postMessage(
          { pluginMessage: { type: "resize", size: size } },
          "*"
        );
      });
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
