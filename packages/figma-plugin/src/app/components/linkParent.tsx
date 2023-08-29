export function linkParent(obj: any) {
  obj.children?.forEach((child) => {
    child.parent = obj;
    linkParent(child);
  });
}
