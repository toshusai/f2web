import {
  figmaNodeToDomNode,
  stylesToClassAttrsRecursive,
} from "./converter/figmaNodeToDomNode";
import { domNodeToHtml } from "./converter/domNodeToHtml";
import { DomNode } from "./converter/DomNode";
import { parseDomName } from "./parseDomName";
import { createCssVars, colorsToCssVars } from "./initFigmaPlugin";

export async function postPreviewMessage() {
  const node = figma.currentPage.selection[0];
  if (!node) return;
  if (node.type !== "COMPONENT_SET") return;
  const ctx: any = {
    root: node,
    ignoreInstance: true,
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
  const html = domNodeToHtml(domNodes[0], 0, true);

  ctx.ignoreInstance = false;
  const rawDomNodes = (
    await Promise.all(
      node.children.map((child) => figmaNodeToDomNode(child, ctx))
    )
  ).filter((x) => x !== null) as DomNode[];
  if (!rawDomNodes) return;
  rawDomNodes.forEach((x) => {
    stylesToClassAttrsRecursive(x);
  });

  const { cssVars, colors } = createCssVars();
  if (colors) {
    colorsToCssVars(colors, cssVars);
  }
  ctx.colors = colors;
  figma.ui.postMessage({
    type: "selection",
    message: {
      domNodes: rawDomNodes,
      html: html,
      ctx: ctx,
      cssVars,
    },
  });
}
