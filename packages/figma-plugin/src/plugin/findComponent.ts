
export function findComponent(node?: any): ComponentNode | null {
  if (!node) return null;
  if (node.type === "COMPONENT") return node;

  if (node.parent === null) {
    return null;
  }

  return findComponent(node.parent) as ComponentNode;
}
