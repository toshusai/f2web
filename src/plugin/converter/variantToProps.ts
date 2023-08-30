import { convertToVariantAvairableName } from "./figmaNodeToDomNode";

export function variantToProps(node: ComponentSetNode) {
  const props = {};
  Object.keys(node.variantGroupProperties).forEach((key) => {
    const value = node.variantGroupProperties[key];
    props[convertToVariantAvairableName(key)] = value.values
      .map((x) => `"${x}"`)
      .join(" | ");
  });
  return props;
}
