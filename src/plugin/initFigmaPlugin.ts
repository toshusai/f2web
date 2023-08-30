import { convertToCssAvairableName } from "../../packages/examples/src/code-writer/convertToCssAvairableName";
import { colorToHex } from "./colorToHex";
import { getReactSrc } from "./converter/dimensions";

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
    figma.on("selectionchange", () => {
      const node = figma.currentPage.selection[0];
      if (!node) return;
      if (node.type !== "COMPONENT_SET") return;
      const ctx: any = {
        root: node,
      };
      const html = getReactSrc(node.children[0], ctx);

      const cssVars: any = {};
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
      if (ctx.colors) {
        Object.keys(ctx.colors).forEach((key) => {
          const variable = figma.variables.getVariableById(ctx.colors[key]);
          if (variable) {
            ctx.colors[key] = `var(--${convertToCssAvairableName(
              variable.name
            )})`;
          }
          const color = figma.getStyleById(ctx.colors[key]);
          if (color) {
            ctx.colors[key] = `var(--${convertToCssAvairableName(color.name)})`;
            if (color.type === "PAINT") {
              const paint = color as PaintStyle;
              const paints = paint.paints;
              if (paints.length === 1) {
                const p = paints[0];
                if (p.type === "SOLID") {
                  if (cssVars["__default__"] === undefined)
                    cssVars["__default__"] = {};
                  cssVars["__default__"][
                    convertToCssAvairableName(color.name)
                  ] = colorToHex(p.color, p.opacity ?? 1);
                }
              }
            }
          }
        });
      }
      figma.ui.postMessage({
        type: "selection",
        message: {
          html: html,
          ctx: ctx,
          cssVars,
        },
      });
    });
    figma.on("documentchange", () => {});
  }
}
