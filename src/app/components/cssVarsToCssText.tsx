import { convertToCssAvairableName } from "../../plugin/converter/convertToCssAvairableName";

export function cssVarsToCssText(cssVars: any) {
  let css = "";
  Object.keys(cssVars).forEach((theme) => {
    let themeCss = `:root`;
    if (theme === "__default__") {
      themeCss += ` {`;
    } else {
      themeCss += `[data-theme="${theme}"] {`;
    }

    Object.keys(cssVars[theme]).forEach((key) => {
      themeCss += ` --${convertToCssAvairableName(key)}: ${cssVars[theme][key]};`;
    });
    themeCss += "}\n";
    css += themeCss;
  });
  return css;
}
