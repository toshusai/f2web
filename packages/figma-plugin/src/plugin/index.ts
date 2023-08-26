import { figmaNodeToJson } from "..";

function postCreate() {
  const node = figma.currentPage.selection[0];
  const componentSet = findComponentSetParent(node);
  if (componentSet === null) return;
  const body = JSON.stringify(figmaNodeToJson(componentSet));
  fetch("http://localhost:3000/create", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: body,
  });
}

if (typeof figma !== "undefined") {
  figma.showUI(__html__);
  figma.ui.resize(512, 256);
  figma.ui.on("message", (msg: any) => {
    if (msg.type === "resize") {
      figma.ui.resize(msg.size.w, msg.size.h);
      figma.clientStorage.setAsync("size", msg.size).catch(() => {});
    }
    if (msg.type === "create") {
      postCreate();
    }
    if (msg.type === "getSelection") {
      const node = figma.currentPage.selection[0];
      const componentSet = findComponentSetParent(node);
      if (componentSet === null) return;
      const body = figmaNodeToJson(componentSet);
      figma.ui.postMessage({ type: "selection", message: body });
    }
  });
  figma.on("documentchange", () => {
    const node = figma.currentPage.selection[0];
    const componentSet = findComponentSetParent(node);
    if (componentSet === null) return;
    const body = figmaNodeToJson(componentSet);
    figma.ui.postMessage({ type: "selection", message: body });
  });
}

function findComponentSetParent(node?: any) {
  if (!node) return null;

  if (node.parent === null) {
    return null;
  }
  if (node.parent.type === "COMPONENT_SET") {
    return node.parent;
  }
  return findComponentSetParent(node.parent);
}
