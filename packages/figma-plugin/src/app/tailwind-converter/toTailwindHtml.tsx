import { WebNode } from "../../../../web/src";
import {
  DimensionPorps,
  FillProps,
  LayoutProps,
  StrokeProps,
} from "../../../../core/src";
import { layoutToClasses } from "./layoutToClasses";
import { dimensionToClasses } from "./dimensionToClasses";
import { fillToClasses } from "./fillToClasses";
import { effectToClasses } from "./effectToClasses";
import { textPropsToClasses } from "./textPropsToClasses";
import { strokesToClasses } from "./strokesToClasses";
import { TextProps } from "../../../../core/src/types/TextProps";

export function toTailwindHtml(webNode: WebNode) {
  const props = webNode.props;
  const children = "children" in webNode ? webNode.children : undefined;
  const classes = [
    ...layoutToClasses(props as LayoutProps),
    ...fillToClasses(props as FillProps, webNode.type),
    ...dimensionToClasses(props as DimensionPorps),
    ...textPropsToClasses(props as TextProps),
    ...effectToClasses(props),
    ...strokesToClasses(props as StrokeProps),
  ];
  const isImage = webNode.props.src !== undefined;

  let tag = "div";
  if (isImage) {
    tag = "img";
  }
  if (webNode.type === "SlotInstance") {
    return `\${props.${webNode.props.name}}`;
  }

  if (webNode.type === "SVG") {
    return webNode.props.svg;
  }
  if (webNode.type === "Instance") {
    return `<${webNode.props.name} />`;
  }
  const attrs: { [key: string]: string } = {};
  if (isImage) {
    attrs.src = `https://picsum.photos/seed/${props.src}/600/400`;
  }

  const child = children
    ? children.map((child) => toTailwindHtml(child)).join("")
    : "text" in props && typeof props.text === "string"
    ? props.text
    : "text" in props && typeof props.text === "function"
    ? props.text()
    : "";
  const html = `<${tag} class="${classes.join(" ")}" ${Object.entries(
    attrs
  ).map(([key, value]) => `${key}="${value}"`)}>${child}</${tag}>`;
  return html;
}
