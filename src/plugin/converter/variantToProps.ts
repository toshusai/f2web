import { Props, convertToVariantAvairableName } from "./figmaNodeToDomNode";

export function variantToProps(node: ComponentSetNode): Props {
  const props: Props = {};
  Object.keys(node.variantGroupProperties).forEach((key) => {
    const value = node.variantGroupProperties[key];
    if (value.values.length <= 1) return;
    props[convertToVariantAvairableName(key)] = {
      type: value.values,
      defaultValue: `"${value.values[0]}"`,
    };
  });
  return props;
}
