import React, { useEffect } from "react";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";
import { addMessageEventListener } from "../addMessageEventListener";
import { Preview } from "./Preview";
import { Button } from "./Button";
import { update } from "./update";

export declare const prettierPlugins: any;
export declare const prettier: any;

export async function post(path: string, body: any) {
  const res = await fetch("http://localhost:3000" + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json;
}

export function App() {
  const [message, setMessage] = React.useState<any | null>(null);

  useEffect(() => {
    hljs.registerLanguage("typescript", typescript);
    const selection = addMessageEventListener("selection", (message) => {
      setMessage({
        type: "selection",
        message,
      });
    });
    const gen = addMessageEventListener("generate", (message) => {
      update(message);
      setMessage({
        type: "generate",
        message,
      });
    });
    return () => {
      selection();
      gen();
    };
  }, []);

  const handleClickGenerate = () => {
    parent.postMessage({ pluginMessage: { type: "generate" } }, "*");
  };

  if (
    message === null ||
    (message.type === "selection" && message.message.type !== "COMPONENT_SET")
  ) {
    return (
      <div className="py-[8px] flex justify-center w-full flex-col gap-[8px] items-center h-[100vh]">
        <Button disabled>Generate</Button>
        <div className="h-[24px]">Select Component Set</div>
      </div>
    );
  } else if (message.type === "selection") {
    return (
      <div className="py-[8px] flex justify-center w-full flex-col gap-[8px] items-center h-[100vh]">
        <Button onClick={handleClickGenerate}>Generate</Button>
        <div className="h-[24px]"></div>
      </div>
    );
  }

  return (
    <div>
      <Preview message={message.message} />
      <Resize />
    </div>
  );
}
