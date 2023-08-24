import { WebNode } from "../../web/src";

export function webNodeToFrameJSXString(wNode: WebNode, depth = 0) {
  const attrs = Object.entries(wNode.props)
    .map(([key, value]) => {
      if (value === undefined) return "";
      if (key === "src") {
        return `as="img" src={${value}}`;
      }
      if (typeof value === "function") return `${key}={${value()}}`;
      if (typeof value === "number") return `${key}={${value}}`;
      if (typeof value === "string") return `${key}="${value}"`;
      if (typeof value === "boolean") return `${key}={${value}}`;
      if (typeof value === "object") return `${key}={${JSON.stringify(value)}}`;
      return "";
    })
    .join(" ")
    .replace(/ +/g, " ");
  if (wNode.type === "Text") return `<Text ${attrs} />`;
  const children = wNode.children
    ?.map((child) => webNodeToFrameJSXString(child, depth + 1))
    .join("\n");
  const indent = "  ".repeat(depth);
  return `<Frame ${attrs}>\n${indent}${
    children !== undefined ? children : ""
  }\n${indent}</Frame>`;
}
