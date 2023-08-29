
export function findComponentSetParent(node?: any): ComponentSetNode | null {
  if (!node) return null;

  if (node.parent === null) {
    return null;
  }
  if (node.parent.type === "COMPONENT_SET") {
    return node.parent;
  }
  return findComponentSetParent(node.parent) as ComponentSetNode;
}
