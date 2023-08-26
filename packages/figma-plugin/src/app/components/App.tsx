import React from "react";
import { toTailwindHtml } from "..";
import { figmaNode2WebNode } from "../../../../web/src";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
function addEventListener(type: string, callback: (message: any) => void) {
  let f = (event) => {
    const { type: t, message } = event.data.pluginMessage;
    if (type === t) {
      callback(message);
    }
  };
  window.addEventListener("message", f);
  return () => {
    window.removeEventListener("message", f);
  };
}
declare const prettierPlugins: any;
declare const prettier: any;

function linkParent(obj: any) {
  obj.children?.forEach((child) => {
    child.parent = obj;
    linkParent(child);
  });
}

function nullToUndefinedRecursive(obj) {
  if (obj === null) return undefined;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => nullToUndefinedRecursive(item));
  }
  const newObj = {};
  for (const key in obj) {
    newObj[key] = nullToUndefinedRecursive(obj[key]);
  }
  return newObj;
}

export function App() {
  addEventListener("selection", (message) => {
    const preview = document.getElementById("preview");
    if (!preview) return;
    linkParent(message);
    const webNode = nullToUndefinedRecursive(figmaNode2WebNode(message));
    preview.innerHTML = toTailwindHtml(webNode);
    const codeContent = document.getElementById("code-content");
    if (!codeContent) return;
    const html = prettier.format(preview.innerHTML, {
      parser: "html",
      plugins: prettierPlugins,
      bracketSameLine: true,
      printWidth: 256,
    });
    codeContent.textContent = html;
    hljs.highlightAll();
  });

  return (
    <div>
      <div id="preview"></div>
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
