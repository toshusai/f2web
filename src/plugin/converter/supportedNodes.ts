export function supportedNodes(
  node: SceneNode
): node is
  | FrameNode
  | ComponentNode
  | ComponentSetNode
  | InstanceNode
  | VectorNode
  | TextNode {
  return (
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "VECTOR" ||
    node.type === "INSTANCE" ||
    node.type === "TEXT"
  );
}
