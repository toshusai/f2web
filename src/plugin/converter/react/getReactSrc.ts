import { domNodeToHtml } from "./domNodeToHtml";
import { DomNode } from "../../types/DomNode";
import { contextPropsToReactPropsString } from "./contextPropsToReactPropsString";
import { Context } from "../../types/Context";
import {
  generateReactComponent,
  importLine,
} from "../react-styled/getReactStyledSrc";

export function getReactSrc(node: DomNode, ctx: Context) {
  const jsx = domNodeToHtml(node, 2, false, true, false, ctx);

  let src = importLine("React", "react", true);

  src += Object.keys(ctx.dependencies ?? {})
    .filter((key) => jsx.includes(`<${key}`))
    .map((key) => {
      return importLine(key, `../${key}`);
    })
    .join("");

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

  src += generateReactComponent(ctx.name, props, jsx);

  return src;
}
