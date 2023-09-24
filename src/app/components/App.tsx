import React, { useEffect } from "react";
import { Resize } from "./Resize";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";
import { addMessageEventListener } from "../addMessageEventListener";
import { Preview } from "./Preview";
import { Button } from "./Button";

import "../index.css";

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
      setMessage({
        type: "generate",
        message,
      });
    });
    const error = addMessageEventListener("error", (message) => {
      setMessage({
        type: "error",
        message,
      });
    });
    return () => {
      selection();
      gen();
      error();
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
      <div className="box">
        <Button disabled>Generate</Button>
        <div
          style={{
            height: "24px",
          }}
        >
          Select Component Set
        </div>
      </div>
    );
  } else if (message.type === "selection") {
    return (
      <div className="box">
        <Button onClick={handleClickGenerate}>Generate</Button>
        <div
          style={{
            height: "24px",
          }}
        ></div>
      </div>
    );
  } else if (message.type === "error") {
    return (
      <div className="box">
        <Button disabled>Generate</Button>
        <div
          className="mono"
          style={{
            height: "24px",
            padding: "0 32px",
            color: "#ff0000",
            width: "-webkit-fill-available",
            overflowWrap: "anywhere",
          }}
        >
          {message.message}
        </div>
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
