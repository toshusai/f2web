import { colorToHex } from "./colorToHex";
import {
  convertToCssAvairableName,
  figmaNodeToDomNode,
} from "./converter/figmaNodeToDomNode";
import { domNodeToHtml } from "./converter/domNodeToHtml";

/**
 * CSS Variables
 * @example
 */
type Colors = {
  // variableName: variableId
  [key: string]: string;
};

/**
 * CSS Variables
 * @example
 * {
 *   "light": {
 *     "color-primary": "#000000",
 *     "color-secondary": "#ffffff"
 *   },
 * }
 *
 */
type CssVars = Record<string, Record<string, string>>;

function colorsToCssVars(colors: Colors, cssVars: CssVars) {
  Object.keys(colors).forEach((key) => {
    const variable = figma.variables.getVariableById(colors[key]);
    if (variable) {
      colors[key] = `var(--${convertToCssAvairableName(variable.name)})`;
    }
    const color = figma.getStyleById(colors[key]);
    if (color) {
      colors[key] = `var(--${convertToCssAvairableName(color.name)})`;
      if (color.type === "PAINT") {
        const paint = color as PaintStyle;
        const paints = paint.paints;
        if (paints.length === 1) {
          const p = paints[0];
          if (p.type === "SOLID") {
            if (cssVars["__default__"] === undefined)
              cssVars["__default__"] = {};
            cssVars["__default__"][convertToCssAvairableName(color.name)] =
              colorToHex(p.color, p.opacity ?? 1);
          } else if (p.type === "GRADIENT_LINEAR") {
            if (cssVars["__default__"] === undefined)
              cssVars["__default__"] = {};
            cssVars["__default__"][
              convertToCssAvairableName(color.name)
            ] = `linear-gradient(45deg, ${p.gradientStops
              .map(
                (stop) => `${colorToHex(stop.color, 1)} ${stop.position * 100}%`
              )
              .join(", ")})`;
          }
        }
      }
    }
  });
}

function createCssVars() {
  const cssVars: CssVars = {};
  const colors = figma.variables.getLocalVariables("COLOR");
  colors.forEach((variable) => {
    const collection = figma.variables.getVariableCollectionById(
      variable.variableCollectionId
    );
    if (!collection) return;
    collection.modes.forEach((mode) => {
      if (cssVars[mode.name] === undefined) cssVars[mode.name] = {};
      const value = variable.valuesByMode[mode.modeId] as RGBA;
      cssVars[mode.name][variable.name] =
        colorToHex(
          {
            r: value.r,
            g: value.g,
            b: value.b,
          },
          value.a
        ) ?? "";
    });
  });
  return cssVars;
}

export function initFigmaPlugin() {
  if (typeof figma !== "undefined") {
    figma.showUI(__html__);
    figma.ui.resize(512, 256);
    figma.ui.on("message", (msg: any) => {
      if (msg.type === "resize") {
        figma.ui.resize(msg.size.w, msg.size.h);
        figma.clientStorage.setAsync("size", msg.size).catch(() => {});
      }
    });
    figma.on("selectionchange", async () => {
      await postPreviewMessage();
    });
    figma.on("run", async () => {
      await postPreviewMessage();
    });
    figma.on("documentchange", () => {});
  }
}

async function postPreviewMessage() {
  const node = figma.currentPage.selection[0];
  if (!node) return;
  if (node.type !== "COMPONENT_SET") return;
  const ctx: any = {
    root: node,
    ignoreInstance: true,
  };
  const domNode = await figmaNodeToDomNode(node.children[0], ctx);
  if (!domNode) return;
  const html = domNodeToHtml(domNode, 0, true);

  ctx.ignoreInstance = false;
  const rawDomNode = await figmaNodeToDomNode(node.children[0], ctx);
  if (!rawDomNode) return;

  const cssVars = createCssVars();
  if (ctx.colors) {
    colorsToCssVars(ctx.colors, cssVars);
  }
  figma.ui.postMessage({
    type: "selection",
    message: {
      domNode: rawDomNode,
      html: html,
      ctx: ctx,
      cssVars,
    },
  });
}
