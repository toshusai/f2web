import { figmaNodeToJson } from "../figmaNodeToJson";
import { findComponentSetParent } from "./findComponentSetParent";
import { findComponent } from "./findComponent";
import { dropSymbolRecursively } from "./dropSymbolRecursively";
import { reduceSamePaints } from "./reduceSamePaints";
import { correctStylePaint } from "./correctStylePaint";

export async function createBySelection() {
  const node = figma.currentPage.selection[0];
  const componentSet = findComponentSetParent(node);
  if (componentSet === null) return;
  const context = {
    colors: reduceSamePaints(correctStylePaint(componentSet)),
  };
  const promises: Promise<any>[] = [];
  const body = figmaNodeToJson(componentSet, promises);
  await Promise.all(promises);
  dropSymbolRecursively(body);
  figma.ui.postMessage({
    type: "selection",
    message: {
      componentSet: body,
      componentIndex: componentSet.children.indexOf(findComponent(node) as any),
      context: context,
    },
  });
}
