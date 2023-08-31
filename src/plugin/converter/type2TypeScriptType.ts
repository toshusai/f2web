export function type2TypeScriptType(type: string) {
  if (type === "string") return "string";
  if (type === "TEXT") return "string";
  if (type === "INSTANCE") return "React.ReactNode";
  if (typeof type === "string" && type.startsWith("?")) {
    return type.replace("?", "");
  }
  if (Array.isArray(type)) return type.map((x) => `"${x}"`).join(" | ");
  return type;
}
