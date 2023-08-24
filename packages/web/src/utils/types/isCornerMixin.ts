export function isCornerMixin(node: any): node is CornerMixin {
  return 'cornerRadius' in node;
}


