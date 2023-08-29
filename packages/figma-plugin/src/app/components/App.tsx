import React, { useEffect } from "react";
import { figmaNode2WebNode } from "../../../../web/src";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { linkParent } from "./linkParent";
import { addMessageEventListener } from "./addMessageEventListener";
import { nullToUndefinedRecursive } from "./nullToUndefinedRecursive";
import { toTailwindHtml } from "../tailwind-converter/toTailwindHtml";
import { changeToProps } from "../tailwind-converter/changeToProps";

declare const prettierPlugins: any;
declare const prettier: any;

export function App() {
  useEffect(() => {
    return addMessageEventListener("selection", (message) => {
      const preview = document.getElementById("preview");
      if (!preview) return;
      const { componentSet, componentIndex } = message;
      linkParent(componentSet);
      const webNode = nullToUndefinedRecursive(
        figmaNode2WebNode(componentSet, componentSet)
      );
      preview.innerHTML = toTailwindHtml(webNode.children[componentIndex]);
      const codeContent = document.getElementById("code-content");
      if (!codeContent) return;
      const html = prettier.format(preview.innerHTML, {
        parser: "html",
        plugins: prettierPlugins,
        bracketSameLine: true,
        printWidth: 256,
      });
      const p = changeToProps(componentSet);
      codeContent.textContent = html + "\n\n" + JSON.stringify(p, null, 2);
      hljs.highlightAll();
    });
  }, []);

  return (
    <div>
      <div id="preview" className="p-[16px]"></div>
      <pre
        style={{
          fontSize: "10px",
          lineHeight: "10px",
        }}
      >
        <code className="language-html" id="code-content"></code>
      </pre>
      <Resize />
    </div>
  );
}
