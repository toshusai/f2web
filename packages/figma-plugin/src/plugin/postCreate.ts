import { figmaNodeToJson } from "../figmaNodeToJson";
import { findComponentSetParent } from "./findComponentSetParent";

export function postCreate() {
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
