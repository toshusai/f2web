import { Props } from "../../types/Props";
import { type2TypeScriptType } from "./type2TypeScriptType";

export function contextPropsToReactPropsString(props: Props) {
  if (!props) return "";
  const keys = Object.keys(props);
  const indent = "  ".repeat(1);
  if (keys.length === 0) return "";

  return `props: {
${keys
  .map((key) => {
    const type = props[key].type;
    const optional = "optional" in type && type.optional ? "?" : "";
    return `${indent}${key}${optional}: ${type2TypeScriptType(
      props[key].type
    )};`;
  })
  .join("\n")}
}`;
}
