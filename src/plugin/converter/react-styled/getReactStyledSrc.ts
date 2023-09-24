import { DomNode } from "../../types/DomNode";
import { Context } from "../../types/Context";
import { contextPropsToReactPropsString } from "../react/contextPropsToReactPropsString";
import {
  ReactStyledContext,
  domNodeToReactStyledString,
} from "./domNodeToHtml";

export function getReactStyledSrc(node: DomNode, ctx: Context) {
  const rootCtx: ReactStyledContext = {
    id: 0,
    cssClasses: [],
    codeGenCtx: ctx,
  };
  const styledJsx = domNodeToReactStyledString(
    node,
    0,
    false,
    false,
    true,
    rootCtx
  );

  let src = importLine("React", "react", true);
  src += importLine("styled", "styled-components", true);
  src += generateImport(ctx.dependencies ?? {}, styledJsx);

  src += "\n";

  const props = contextPropsToReactPropsString({
    ...ctx.props,
    className: {
      type: {
        type: "native",
        value: "string",
        optional: true,
      },
      defaultValue: '""',
    },
  });

  src += generateReactComponent(ctx.name, props, styledJsx);

  src += "\n";

  src += rootCtx.cssClasses.join("\n");

  return src;
}

export function generateReactComponent(
  name: string,
  props: string,
  jsx: string
) {
  return `export function ${name}(${props}) {
  return (
${jsx}
  )
}
`;
}

export function generateImport(
  dependencies: Record<string, string>,
  jsx: string
) {
  return Object.keys(dependencies ?? {})
    .filter((key) => jsx.includes(`<Styled${key}`))
    .map((key) => {
      return importLine(key, `../${key}`);
    })
    .join("");
}

export function importLine(
  name: string,
  from: string,
  defaultImport?: boolean
) {
  if (defaultImport) return `import ${name} from "${from}";\n`;
  return `import { ${name} } from "${from}";\n`;
}
