import { figmaNodeToJson } from "../figmaNodeToJson";
import { findComponentSetParent } from "./findComponentSetParent";
import { reduceSamePaints } from "./reduceSamePaints";
import { correctStylePaint } from "./correctStylePaint";

export function postCreate() {
  const node = figma.currentPage.selection[0];
  const componentSet = findComponentSetParent(node);
  if (componentSet === null) return;
  const context = {
    colors: reduceSamePaints(correctStylePaint(componentSet)),
  };
  const body = JSON.stringify({
    context: context,
    componentSet: figmaNodeToJson(componentSet),
  });

  fetch("http://localhost:3000/create", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
}
