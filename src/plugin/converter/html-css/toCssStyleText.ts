import { Colors } from "../../Colors";
export const DEFAULT_MODE = "__default__";

export function toCssStyleText(colors: Colors[]) {
  const modeMap: Record<string, Colors[]> = {};
  colors?.forEach((x) => {
    modeMap[x.mode] = modeMap[x.mode] ?? [];
    modeMap[x.mode].push(x);
  });

  let allCss = "";
  Object.entries(modeMap).forEach(([mode, colors]) => {
    if (mode === DEFAULT_MODE) {
      allCss += `:root {\n`;
    } else {
      allCss += `:root[data-theme="${mode}"] {\n`;
    }
    colors.forEach((color) => {
      allCss += `  --${color.id}: ${color.value};\n`;
    });
    allCss += "}\n";
  });
  return allCss;
}
