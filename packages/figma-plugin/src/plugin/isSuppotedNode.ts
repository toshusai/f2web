
export function isSuppotedNode(
  node: SceneNode
): node is FrameNode | InstanceNode | ComponentNode | TextNode {
  return (
    node.type === "FRAME" ||
    node.type === "INSTANCE" ||
    node.type === "COMPONENT" ||
    node.type === "TEXT"
  );
}
