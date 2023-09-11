import { colorToHex } from "./utils/colorToHex";
import { convertToCssAvairableName } from "./converter/convertToCssAvairableName";
import { Colors } from "./Colors";

export function createCssVars() {
  const colors = figma.variables.getLocalVariables("COLOR");
  const allColors: Colors[] = [];
  const paints = figma.getLocalPaintStyles();
  paints.forEach((paint) => {
    const p = paint.paints[0];
    const name = convertToCssAvairableName(paint.name);
    allColors[convertToCssAvairableName(paint.id)] = `var(--${name})`;
    const color: Colors = {
      id: convertToCssAvairableName(paint.id),
      name: convertToCssAvairableName(paint.name),
      value: ``,
      mode: "",
    };

    if (p.type === "SOLID") {
      color.value = colorToHex(p.color, p.opacity ?? 1);
      color.mode = "__default__";
      allColors.push(color);
    } else if (p.type === "GRADIENT_LINEAR") {
      color.value = `linear-gradient(45deg, ${p.gradientStops
        .map((stop) => `${colorToHex(stop.color, 1)} ${stop.position * 100}%`)
        .join(", ")})`;
      color.mode = "__default__";
      allColors.push(color);
    }
  });

  colors.forEach((variable) => {
    const collection = figma.variables.getVariableCollectionById(
      variable.variableCollectionId
    );

    if (!collection) return;
    collection.modes.forEach((mode, i) => {
      const color: Colors = {
        id: convertToCssAvairableName(variable.id),
        name: convertToCssAvairableName(variable.name),
        value: ``,
        mode: "",
      };
      let name = mode.name;
      if (i === 0) {
        name = "__default__";
      }
      color.mode = name;
      const value = variable.valuesByMode[mode.modeId] as RGBA;
      color.value =
        colorToHex(
          {
            r: value.r,
            g: value.g,
            b: value.b,
          },
          value.a
        ) ?? "";
      allColors.push(color);
    });
  });
  return allColors;
}
