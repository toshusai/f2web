import { toCamelCase } from "js-convert-case";
import { figmaNode2WebNode } from "../../web/src";
import { webNodeToFrameJSXString } from "./webNodeToFrameJSXString";
import { findAllImageHashes } from "./findAllImageHashes";

export function componentSetToReactCode(node: ComponentSetNode) {
  const firstNode = node.children[0];
  if (firstNode === undefined)
    throw new Error("componentSetToReactCode: firstNode is undefined");
  const wnode = figmaNode2WebNode(
    firstNode as FrameNode | InstanceNode | TextNode
  );
  const defs = node.componentPropertyDefinitions;
  const imageHashes = findAllImageHashes(node);
  const name = node.name ?? "Component";
  const src = `
import { Frame, Text } from "@f2web/core";
export function ${name}(props: {
${
  defs
    ? Object.entries(defs).map(([key, value]) => {
        if (value.type === "TEXT") {
          return `${toCamelCase(key.split("#")[0])}: string`;
        }
      })
    : ""
}
${imageHashes.map((hash) => `$${hash}: string`).join("\n")}
}) {
return (        
${webNodeToFrameJSXString(wnode)}
)
}
`;
  return src;
}
