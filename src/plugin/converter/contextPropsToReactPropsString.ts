import { type2TypeScriptType } from "./type2TypeScriptType";

export function contextPropsToReactPropsString(props: any) {
  if (!props) return "";
  const keys = Object.keys(props);
  const indent = "  ".repeat(1);
  if (keys.length === 0) return "";
  return `props: {
${keys
  .map((key) => `${indent}${key}: ${type2TypeScriptType(props[key].type)};`)
  .join("\n")}
}`;
}
