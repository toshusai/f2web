import { colorToHex } from "./utils/colorToHex";
import { convertToCssAvairableName } from "./converter/convertToCssAvairableName";
import { postPreviewMessage } from "./postPreviewMessage";

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

export function colorsToCssVars(colors: Colors, cssVars: CssVars) {
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

export function createCssVars() {
  const cssVars: CssVars = {};
  const colors = figma.variables.getLocalVariables("COLOR");
  const allColors = {};
  const paints = figma.getLocalPaintStyles();
  paints.forEach((paint) => {
    const p = paint.paints[0];
    const name = convertToCssAvairableName(paint.name);
    allColors[convertToCssAvairableName(paint.id)] = `var(--${name})`;

    if (p.type === "SOLID") {
      if (cssVars["__default__"] === undefined) cssVars["__default__"] = {};
      cssVars["__default__"][name] = colorToHex(p.color, p.opacity ?? 1);
    } else if (p.type === "GRADIENT_LINEAR") {
      if (cssVars["__default__"] === undefined) cssVars["__default__"] = {};
      cssVars["__default__"][name] = `linear-gradient(45deg, ${p.gradientStops
        .map((stop) => `${colorToHex(stop.color, 1)} ${stop.position * 100}%`)
        .join(", ")})`;
    }
  });

  colors.forEach((variable) => {
    const collection = figma.variables.getVariableCollectionById(
      variable.variableCollectionId
    );
    const variableName = convertToCssAvairableName(
      collection?.name + "/" + variable.name
    );
    allColors[
      convertToCssAvairableName(variable.id)
    ] = `var(--${variableName})`;
    if (!collection) return;
    collection.modes.forEach((mode, i) => {
      let name = mode.name;
      if (i === 0) {
        name = "__default__";
      }
      if (cssVars[name] === undefined) cssVars[name] = {};
      const value = variable.valuesByMode[mode.modeId] as RGBA;
      cssVars[name][variableName] =
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
  return {
    cssVars,
    colors: allColors,
  };
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
