import {
  figmaNodeToDomNode,
  isTextDomNode,
} from "./converter/figmaNodeToDomNode";
import { stylesToClassAttrsRecursive } from "./converter/react/stylesToClassAttrsRecursive";
import { DomNode } from "./types/DomNode";
import { parseDomName } from "./converter/parseDomName";
import { createCssVars } from "./createCssVars";
import { compareTreeNode } from "./converter/compareTreeNode";
import { colorToHex } from "./utils/colorToHex";

export function postSelectMessage() {
  const node = figma.currentPage.selection[0];
  if (!node) {
    figma.ui.postMessage({
      type: "selection",
      message: {
        type: null,
      },
    });
  } else {
    figma.ui.postMessage({
      type: "selection",
      message: {
        type: node.type,
      },
    });
  }
}

function getFigmaPageBackgroundColor() {
  const page = figma.currentPage;
  if (page.backgrounds.length === 0) return "#fff";
  const bg = page.backgrounds[0];
  if (bg.type === "SOLID") return colorToHex(bg.color, bg.opacity ?? 1);
  return "#fff";
}

export async function postPreviewMessage() {
  const node = figma.currentPage.selection[0];
  if (!node) return;
  if (node.type !== "COMPONENT_SET") return;
  const ctx: any = {
    root: node,
    ignoreInstance: true,
    colors: [],
    ...parseDomName(node.name),
  };
  const domNodes = (
    await Promise.all(
      node.children.map((child) => figmaNodeToDomNode(child, ctx))
    )
  ).filter((x) => x !== null) as DomNode[];
  if (!domNodes) return;
  domNodes.forEach((x) => {
    stylesToClassAttrsRecursive(x);
  });
  const colors = createCssVars();
  ctx.colors = colors;
  domNodes.forEach((domNode, i) => {
    if (i === 0) return;
    if (isTextDomNode(domNode)) return;
    compareTreeNode(domNodes[0], domNode, domNode.name ?? "");
  });

  ctx.ignoreInstance = false;
  const rawDomNodes = (
    await Promise.all(
      node.children.map((child) => figmaNodeToDomNode(child, ctx))
    )
  ).filter((x) => x !== null) as DomNode[];
  if (!rawDomNodes) return;

  figma.ui.postMessage({
    type: "generate",
    message: {
      domNodes: rawDomNodes,
      ignoreInstancedDomNodes: domNodes,
      ctx: ctx,
      bg: getFigmaPageBackgroundColor(),
    },
  });
}
