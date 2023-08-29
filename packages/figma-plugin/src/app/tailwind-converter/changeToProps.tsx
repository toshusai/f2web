import { typeToType } from "../typeToType";
import { varIdToVariableName } from "../varIdToVariableName";

export function changeToProps(componentSet: ComponentSetNode) {
  const obj = {};
  for (const key in componentSet.componentPropertyDefinitions) {
    const prop = componentSet.componentPropertyDefinitions[key];
    obj[varIdToVariableName(key)] = typeToType(prop.type, prop.variantOptions);
  }
  return obj;
}
