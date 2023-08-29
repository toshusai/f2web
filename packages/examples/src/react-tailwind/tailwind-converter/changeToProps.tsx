import { typeToType } from "./utils/typeToType";
import { varIdToVariableName } from "./utils/varIdToVariableName";

export function changeToProps(componentSet: ComponentSetNode) {
  const obj = {};
  for (const key in componentSet.componentPropertyDefinitions) {
    const prop = componentSet.componentPropertyDefinitions[key];
    obj[varIdToVariableName(key)] = typeToType(prop.type, prop.variantOptions);
  }
  return obj;
}
