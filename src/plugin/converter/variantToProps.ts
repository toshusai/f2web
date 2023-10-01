import { Props } from "../types/Props";
import { convertToVariantAvairableName } from "./figmaNodeToDomNode";

export function variantToProps(node: ComponentSetNode): Props {
  const props: Props = {};
  Object.keys(node.variantGroupProperties).forEach((key) => {
    if (key.startsWith("media")) return;
    const value = node.variantGroupProperties[key];
    if (value.values.length <= 1) return;
    props[convertToVariantAvairableName(key)] = {
      type: {
        type: "union",
        types: value.values,
      },
      defaultValue: `"${value.values[0]}"`,
    };
  });
  return props;
}
