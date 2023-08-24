
export function isRectangleCornerMixin(node: any): node is RectangleCornerMixin {
  return (
    'cornerRadius' in node &&
    'topLeftRadius' in node &&
    'topRightRadius' in node &&
    'bottomLeftRadius' in node &&
    'bottomRightRadius' in node
  );
}
