import { isMixed } from "../../../web/src/utils";
import { isPaintStyle } from "./isPaintStyle";
import { isSuppotedNode } from "./isSuppotedNode";
import { colorToHex } from "./colorToHex";


export function strokeToColorVariable(node: SceneNode) {
  if (!isSuppotedNode(node)) {
    return;
  }
  if (node.strokeStyleId) {
    const paintStyle = figma.getStyleById(node.strokeStyleId);
    if (!paintStyle) throw new Error("paintStyle is undefined");
    if (isPaintStyle(paintStyle)) {
      if (paintStyle.paints.length != 1) {
        throw new Error("paintStyle.paints.length != 1");
      }
      return {
        name: node.strokeStyleId,
        paint: paintStyle.paints[0],
      };
    } else {
      throw new Error("paintStyle is not PaintStyle");
    }
  } else if (node.strokes) {
    if (isMixed(node.strokes)) throw new Error("isMixed");
    if (node.strokes.length > 1) {
      throw new Error("node.strokes.length != 1");
    }
    if (node.strokes.length === 1) {
      const paint = node.strokes[0];
      if (paint.type === "SOLID") {
        return {
          name: colorToHex(paint.color, paint.opacity ?? 1),
          paint: paint,
        };
      }
    }
  }
  return;
}
