import { Props } from "../../types/Props";
import { type2TypeScriptType } from "./type2TypeScriptType";

export function contextPropsToReactPropsString(props: Props) {
  if (!props) return "";
  const keys = Object.keys(props);
  if (keys.length === 0) return "";

  const typeObject = Object.fromEntries(
    keys.map((key) => {
    const type = props[key].type;
    const optional = "optional" in type && (type.optional  ?? false);
      return [key + (optional ? "?" : ''), type2TypeScriptType(props[key].type)]
    })
  );

  const types = generateType(typeObject)

  return typeLine('props', types, false);
}

function generateType(object: Record<string, string>){
  return `{
${Object.entries(object).map(([key, value]) => `${key}: ${value}`).join("\n")}
}`
}


function typeLine(key:string, type:string, optional:boolean){
  if (optional) return `${key}?: ${type}`
  return `${key}: ${type}`
}