import { convertToVariantAvairableName } from "../figmaNodeToDomNode";
import { AttrValue } from "../AttrValue";

/**
 * { "key=value": { type: "value", value: "valriantValue" } } => key={props.key==="value" ? "valriantValue" : "defaultValue"}
 */
export function variantsToTernaryOperator(
  variants: Record<string, AttrValue>,
  defaultValue: string,
  mediaMode: boolean = false
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    if (mediaMode) return "";
    return defaultValue;
  }
  const key = keys[0].split("=")[0];
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]].value;

  let final = defaultValue.replace(/"/g, "").split(" ");
  if (key.startsWith("@")) {
    const variantClasses = variantValue.split(" ");

    // const plusDiff = variantClasses.filter((x) => !final.includes(x));
    const minusDiff = final.filter((x) => !variantClasses.includes(x));
    minusDiff.forEach((x) => {
      if (x === "hidden") {
        final.push(`${value}:flex`);
      }
    });

    final = [
      ...final,
      ...variantsToTernaryOperator(
        Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
        defaultValue.replace(/"/g, ""),
        true
      ).split(" "),
    ];

    return `"${final.join(" ")}"`;
  }
  return `props.${convertToVariantAvairableName(
    key
  )} === "${value}" ? "${variantValue}" : ${variantsToTernaryOperator(
    Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
    defaultValue
  )}`;
}
