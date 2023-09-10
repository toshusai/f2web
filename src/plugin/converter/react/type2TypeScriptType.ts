import { PropType } from "../../types/Props";

export function type2TypeScriptType(type: PropType) {
  let result = "";
  if (type.type === "native") {
    result = "string";
  } else if (type.type === "INSTANCE") {
    result = "React.ReactNode";
  } else if (type.type === "union") {
    result = type.types.map((x) => `"${x}"`).join(" | ");
  } else if (type.type === "typeof") {
    if (isStartsWithUpperCase(type.typeName)) {
      result = `React.ComponentProps<typeof ${type.typeName}>["${type.propName}"]`;
    } else {
      result = `JSX.IntrinsicElements["${type.typeName}"]["${type.propName}"]`;
    }
  }
  if ("optional" in type && type.optional) {
    result = `?${result}`;
  }
  return result;
}

function isStartsWithUpperCase(str: string) {
  return str[0].toUpperCase() === str[0];
}
