import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

export function initReactApp() {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("react-page");
    if (!container) return console.error("No container found");
    const root = createRoot(container);
    root.render(<App />);
  });
}
