import React from "react";

export function Resize() {
  function resizeWindow(e) {
    const size = {
      w: Math.max(50, Math.floor(e.clientX + 5)),
      h: Math.max(50, Math.floor(e.clientY + 5)),
    };
    parent.postMessage({ pluginMessage: { type: "resize", size: size } }, "*");
  }
  return (
    <svg
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.addEventListener("pointermove", resizeWindow);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        e.currentTarget.removeEventListener("pointermove", resizeWindow);
      }}
      style={{
        position: "fixed",
        right: "0",
        bottom: "0",
        cursor: "nwse-resize",
        zIndex: 100,
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 0V16H0L16 0Z" fill="transparent" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path
        d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z"
        fill="#8C8C8C"
      />
    </svg>
  );
}
