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
  figma.ui.resize(256, 128);
  figma.ui.on("message", () => {
    postCreate();
  });
  figma.on("documentchange", () => {
    postCreate();
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
