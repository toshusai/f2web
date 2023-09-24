import { AttrValue } from "../types/AttrValue";

export function nodeToMediaQeurys(
  variants: Record<string, AttrValue>,
  defaultValue: string,
  ignoreInstance
) {
  const keys = Object.keys(variants);
  if (keys.length === 0) {
    return [];
  }
  const key = keys[0].split("=")[0];
  const value = keys[0].split("=")[1];
  const variantValue = variants[keys[0]];
  let final = defaultValue.split(" ");
  if (key.startsWith("@")) {
    const variantClasses = variantValue.value.split(" ");

    const minusDiff = final.filter((x) => !variantClasses.includes(x));
    minusDiff.forEach((x) => {
      if (x === "hidden") {
        final.push(`${value}:flex`);
      }
    });

    final = final;
  }
  final = [
    ...final,
    ...nodeToMediaQeurys(
      Object.fromEntries(keys.slice(1).map((key) => [key, variants[key]])),
      defaultValue,
      ignoreInstance
    ),
  ];
  return final;
}
