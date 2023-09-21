import { Properties } from "../../types/Properties";
import { stylesToCssString } from "../react-styled/stylesToCssString";

export function stylesToCss(name: string, props: Partial<Properties>) {
  let { css, before } = stylesToCssString(props);

  css = css
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  css = `.${name} {\n${css}}`;
  if (before) {
    css = `.${name}::before {\n${before}}\n${css}`;
  }
  return css;
}
