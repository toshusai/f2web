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
  figma.on("selectionchange", async () => {
    const node = figma.currentPage.selection[0];
    const componentSet = findComponentSetParent(node);
    if (componentSet === null) return;
    const promises: Promise<any>[] = [];
    const body = figmaNodeToJson(componentSet, promises);
    await Promise.all(promises);
    dropSymbolRecursively(body);
    figma.ui.postMessage({
      type: "selection",
      message: {
        componentSet: body,
        componentIndex: componentSet.children.indexOf(
          findComponent(node) as any
        ),
      },
    });
  });
  figma.on("documentchange", () => {
    const node = figma.currentPage.selection[0];
    const componentSet = findComponentSetParent(node);
    if (componentSet === null) return;
    const body = figmaNodeToJson(componentSet);
    dropSymbolRecursively(body);
    figma.ui.postMessage({ type: "selection", message: body });
  });
}

function isSymbol(obj: any) {
  return obj && obj.type === "SYMBOL";
}

function dropSymbolRecursively(obj: any) {
  if (typeof obj !== "object" || obj === null) return obj;
  try {
    Object.keys(obj).forEach((key) => {
      if (
        obj[key] instanceof Symbol ||
        isSymbol(obj[key]) ||
        typeof obj[key] === "symbol"
      ) {
        delete obj[key];
      }
      if (typeof obj[key] === "object") {
        dropSymbolRecursively(obj[key]);
      }
    });
  } catch (e) {}
  return obj;
}

function findComponent(node?: any): ComponentNode | null {
  if (!node) return null;
  if (node.type === "COMPONENT") return node;

  if (node.parent === null) {
    return null;
  }

  return findComponent(node.parent) as ComponentNode;
}

function findComponentSetParent(node?: any): ComponentSetNode | null {
  if (!node) return null;

  if (node.parent === null) {
    return null;
  }
  if (node.parent.type === "COMPONENT_SET") {
    return node.parent;
  }
  return findComponentSetParent(node.parent) as ComponentSetNode;
}
