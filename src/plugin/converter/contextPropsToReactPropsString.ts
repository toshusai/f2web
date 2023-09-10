import { Props } from "./figmaNodeToDomNode";
import { type2TypeScriptType } from "./type2TypeScriptType";

export function contextPropsToReactPropsString(props: Props) {
  if (!props) return "";
  const keys = Object.keys(props);
  const indent = "  ".repeat(1);
  if (keys.length === 0) return "";

  return `props: {
${keys
  .map((key) => {
    const optional = props[key].type.toString().startsWith("?") ? "?" : "";
    return `${indent}${key}${optional}: ${type2TypeScriptType(
      props[key].type
    )};`;
  })
  .join("\n")}
}`;
}
