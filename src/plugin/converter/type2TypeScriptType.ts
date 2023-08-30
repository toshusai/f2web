export function type2TypeScriptType(type: string) {
  if (type === "TEXT") return "string";
  if (type === "INSTANCE") return "React.ReactNode";
  return type;
}
