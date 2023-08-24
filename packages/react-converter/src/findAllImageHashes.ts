import { isMixed } from "../../web/src/utils";

export function findAllImageHashes(node: SceneNode): string[] {
  const imageHashes: string[] = [];
  if (node.type === "FRAME") {
    node.children.forEach((child) => {
      imageHashes.push(...findAllImageHashes(child));
    });
    if (!isMixed(node.fills)) {
      node.fills.forEach((fill) => {
        if (fill.type === "IMAGE" && fill.imageHash !== null) {
          imageHashes.push(fill.imageHash);
        }
      });
    }
  } else if ("children" in node) {
    node.children.forEach((child) => {
      imageHashes.push(...findAllImageHashes(child));
    });
  }
  return imageHashes;
}
