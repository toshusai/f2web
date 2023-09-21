import { Properties } from "../../types/Properties";
import { isFistLetterUpperCase } from "./isFistLetterUpperCase";
import { stylesToCssString } from "./stylesToCssString";

export function stylesToStyledCss(
  name: string,
  props: Partial<Properties>,
  domName = "div"
) {
  let { css, before } = stylesToCssString(props);
  css = `const ${name} = styled${
    isFistLetterUpperCase(domName) ? `(${domName})` : `.${domName}`
  }\`
${css.split("\n").map(x=>`  ${x}`).join("\n")}${before}
\`
`;

  return css;
}

export function createStyledHeader(
  name: string,
  domName: string,
  content: string,
  generic?: string
) {
  return `const ${name} = styled${
    isFistLetterUpperCase(domName) ? `(${domName})` : `.${domName}`
  }${generic !== undefined ? `<${generic}>` : ""}\`
${content}
\``;
}

export function toInner(props: Partial<Properties>) {
  let { css, before } = stylesToCssString(props);

  css = css
    .trimEnd()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

  before =
    before != ""
      ? `\n  &:before {\n${before
          .trimEnd()
          .split(`\n`)
          .map((x) => `    ${x}`)
          .join("\n")}
  }`
      : "";

  return {
    css,
    before,
  };
}
