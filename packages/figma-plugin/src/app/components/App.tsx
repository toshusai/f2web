import React from "react";

export function App() {
  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: "create" } }, "*");
  };

  return (
    <div>
      <button onClick={onCreate}>create</button>
    </div>
  );
}
