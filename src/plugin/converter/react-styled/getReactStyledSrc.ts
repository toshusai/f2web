import { DomNode } from "../../types/DomNode";
import { Context } from "../../types/Context";
import { contextPropsToReactPropsString } from "../react/contextPropsToReactPropsString";
import { ReactStyledContext, domNodeToReactStyledString } from "./domNodeToHtml";


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
  const imports = generateImport(ctx.dependencies ?? {}, styledJsx);
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
      })

  return `${importLine("React", "react")}
${importLine("styled", "styled-components")}
${imports}
${generateReactComponent(ctx.name, props, styledJsx)}
${rootCtx.cssClasses.join("\n")}
`;
}

function generateReactComponent(name:string, props:string, jsx:string){
  return `export function ${name}(${props}) {
  return (
${jsx}
  )
}
`
}


function generateImport(dependencies: Record<string, string>, jsx:string) {
  return Object.keys(dependencies ?? {})
  .filter((key) => jsx.includes(`<Styled${key}`))
  .map((key) => {
    return importLine(key, `../${key}`);
  })
  .join("")
}

function importLine(name:string, from:string){
  return `import { ${name} } from "${from}";\n`;
}