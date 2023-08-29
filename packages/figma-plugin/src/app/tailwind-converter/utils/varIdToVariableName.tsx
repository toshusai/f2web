import { toCamelCase } from "js-convert-case";

export function varIdToVariableName(id: string) {
  let name = id.split("#")[0];
  name = name.replace(/ /g, "");
  name = toCamelCase(name);
  if (name.match(/^[0-9]/)) name = "_" + name;
  return name;
}
