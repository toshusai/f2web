import { Context } from "../../types/Context";
import { DomNode } from "../../types/DomNode";
import { HtmlCssContext } from "./HtmlCssContext";
import { toCssStyleText } from "./toCssStyleText";
import { domNodeToHtmlCss } from "./domNodeToHtml";

export function domNodeToHtmlCssAll(node: DomNode, rootCtx: Context) {
  let allCss = toCssStyleText(rootCtx.colors ?? []);
  const ctx: HtmlCssContext = {
    id: 0,
    cssClasses: [],
    isPreview: true,
  };
  const html = domNodeToHtmlCss(node, 0, ctx);
  const css = ctx.cssClasses.join("\n");
  return `
<style>
${allCss}\n
${css}\n
</style>
${html}`;
}
