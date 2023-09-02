import { colorToHex } from "./colorToHex";
import {
  convertToCssAvairableName,
  figmaNodeToDomNode,
} from "./converter/figmaNodeToDomNode";
import { domNodeToHtml } from "./converter/domNodeToHtml";
import { DomNode } from "./converter/DomNode";

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

// get "div" from "<div>"
function getTag(name: string) {
  const reg = /<([a-zA-Z0-9-]+)(\s|>)/;
  const result = name.match(reg);
  if (result) {
    return result[1];
  }
  return "div";
}

// get "onClick, className" from "[onClick, className]"
function getAttribute(name: string): string[] {
  const reg = /\[([a-zA-Z0-9-,\s]+)\]/;
  const result = name.match(reg);
  if (result) {
    return result[1].split(",").map((x) => x.trim());
  }
  return [];
}

export type DomMeta = {
  tagName: string;
  attributes: string[];
};

export function parseDomName(name: string): {
  name: string;
  meta: DomMeta;
} {
  const sp = name.split("#");
  const meta = sp[1] ?? "";

  const domName = sp[0];
  return {
    name: convertToCssAvairableName(domName),
    meta: {
      tagName: getTag(meta),
      attributes: getAttribute(meta),
    },
  };
}

async function postPreviewMessage() {
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
  const html = domNodeToHtml(domNodes[0], 0, true);

  ctx.ignoreInstance = false;
  const rawDomNodes = (
    await Promise.all(
      node.children.map((child) => figmaNodeToDomNode(child, ctx))
    )
  ).filter((x) => x !== null) as DomNode[];
  if (!rawDomNodes) return;

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
