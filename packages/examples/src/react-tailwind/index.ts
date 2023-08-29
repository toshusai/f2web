import { toCamelCase } from "js-convert-case";
import { WebNode, figmaNode2WebNode } from "../../../web/src";
import { findAllImageHashes } from "../react";
import { toTailwindHtml } from "./tailwind-converter/toTailwindHtml";
export function componentSetToReactTailwindCode(node: ComponentSetNode) {
  const firstNode = node.children[0];
  if (firstNode === undefined)
    throw new Error("componentSetToReactCode: firstNode is undefined");
  const wnode = figmaNode2WebNode(
    firstNode as FrameNode | InstanceNode | TextNode,
    node,
    {
      useInstance: true,
    }
  );
  if (!wnode) throw new Error("componentSetToReactCode: wnode is undefined");
  const defs = node.componentPropertyDefinitions;
  const imageHashes = findAllImageHashes(node);
  const name = node.name ?? "Component";
  const otherInstances = findAllInstancesByWebNode(wnode);
  const src = `
  ${otherInstances.map((instance) => {
    return `
        import { ${instance.props.name} } from "./${instance.props.name}";
        `;
  })}
  export function ${name}(props: {
  ${
    defs
      ? Object.entries(defs)
          .map(([key, value]) => {
            if (value.type === "TEXT") {
              return `${toCamelCase(key.split("#")[0])}: string`;
            }
            return "";
          })
          .filter((x) => x)
          .join(";")
      : ""
  }
  ${imageHashes.map((hash) => `$${hash}: string`).join("\n")}
  }) {
  return (        
  ${toTailwindHtml(wnode)}
  )
  }
  `;
  return src;
}

function findAllInstancesByWebNode(node: WebNode) {
  const instances: any[] = [];
  if ("children" in node) {
    for (const child of node.children) {
      if (child.type === "Instance") {
        instances.push(child);
      }
      instances.push(...findAllInstancesByWebNode(child));
    }
  }
  return instances;
}

// function findAllInstances(node: SceneNode) {
//   const instances: InstanceNode[] = [];
//   if ("children" in node) {
//     for (const child of node.children) {
//       if (child.type === "INSTANCE") {
//         instances.push(child);
//       }
//       instances.push(...findAllInstances(child));
//     }
//   }
//   return instances;
// }
