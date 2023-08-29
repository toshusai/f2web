import { fillsToColorVariable } from "./fillsToColorVariable";
import { ColorVariable } from "./ColorVariable";
import { isSuppotedNode } from "./isSuppotedNode";
import { strokeToColorVariable } from "./strokeToColorVariable";


export function correctStylePaint(
  node: SceneNode,
  paints: ColorVariable[] = []
) {
  if (isSuppotedNode(node)) {
    const fill = fillsToColorVariable(node);
    if (fill) {
      paints.push(fill);
    }
    const stroke = strokeToColorVariable(node);
    if (stroke) {
      paints.push(stroke);
    }
  }
  if ("children" in node) {
    node.children.forEach((child) => correctStylePaint(child, paints));
  }
  return paints;
}
