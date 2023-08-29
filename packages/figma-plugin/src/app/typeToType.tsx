export function typeToType(
  type: ComponentPropertyType,
  variantOptions?: string[]
) {
  if (type === "TEXT") return "string";
  if (type === "BOOLEAN") return "boolean";
  if (type === "INSTANCE_SWAP") return "Component";
  if (type === "VARIANT")
    return variantOptions?.map((v) => `"${v}"`).join(" | ");
  throw new Error(`Unknown type ${type}`);
}
