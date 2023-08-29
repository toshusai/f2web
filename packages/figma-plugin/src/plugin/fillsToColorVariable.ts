import { isMixed } from "../../../web/src/utils";
import { isPaintStyle } from "./isPaintStyle";
import { isSuppotedNode } from "./isSuppotedNode";
import { colorToHex } from "./colorToHex";


export function fillsToColorVariable(node: SceneNode) {
  if (!isSuppotedNode(node)) {
    return;
  }
  if (node.fillStyleId) {
    if (isMixed(node.fillStyleId)) throw new Error("isMixed");
    const paintStyle = figma.getStyleById(node.fillStyleId);
    if (!paintStyle) throw new Error("paintStyle is undefined");
    if (isPaintStyle(paintStyle)) {
      if (paintStyle.paints.length != 1) {
        throw new Error("paintStyle.paints.length != 1");
      }
      return {
        name: node.fillStyleId,
        paint: paintStyle.paints[0],
      };
    } else {
      throw new Error("paintStyle is not PaintStyle");
    }
  } else if (node.fills) {
    if (isMixed(node.fills)) throw new Error("isMixed");
    if (node.fills.length > 1) {
      throw new Error("node.fills.length != 1");
    }
    if (node.fills.length === 1) {
      const paint = node.fills[0];
      if (paint.type === "SOLID") {
        if (paint.boundVariables && paint.boundVariables.color) {
          return {
            name: paint.boundVariables.color.id,
            paint: paint,
          };
        } else {
          return {
            name: colorToHex(paint.color, paint.opacity ?? 1),
            paint: paint,
          };
        }
      }
    }
  }
}
