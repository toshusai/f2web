import { convertToVariantAvairableName } from "./figmaNodeToDomNode";
import { AttrValue } from "./AttrValue";
import { DomNode } from "./DomNode";

export function handleInstanceNode(node: InstanceNode, ctx: any): DomNode {
  if (!node.mainComponent) {
    throw new Error("node.mainComponent is null");
  }
  if (node.componentPropertyReferences?.mainComponent) {
    for (const key in ctx.root.componentPropertyDefinitions) {
      if (node.componentPropertyReferences.mainComponent === key) {
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(key)] = "INSTANCE";
        return {
          type: "text",
          value: `{props.${convertToVariantAvairableName(key)}}`,
        };
      }
    }
  }

  const mainComponent = node.mainComponent;
  const tag = mainComponent.parent?.name;
  if (!tag) throw new Error("tag is null");
  ctx.dependencies = ctx.dependencies ?? {};
  ctx.dependencies[tag] = "INSTANCE";

  const attrs: Record<string, AttrValue> = {};
  Object.entries(node.componentProperties).forEach(([key, value]) => {
    const attrKey = convertToVariantAvairableName(key);
    if (value.type === "TEXT") {
      attrs[attrKey] = value.value.toString();
    } else if (value.type === "VARIANT") {
      attrs[attrKey] = value.value.toString();
    } else if (value.type === "INSTANCE_SWAP") {
      if (typeof value.value === "boolean") {
        throw new Error("value.value is boolean");
      }
      const component = figma.getNodeById(value.value);
      if (!component) throw new Error("component is null");
      const name = component.parent?.name;
      if (!name) throw new Error("name is null");

      const nameToTag = component.name
        .split(",")
        .map((x) => {
          const sp = x.split("=");
          return `${convertToVariantAvairableName(sp[0])}="${sp[1]}"`;
        })
        .join(" ");

      ctx.dependencies = ctx.dependencies ?? {};
      ctx.dependencies[convertToVariantAvairableName(name)] = "INSTANCE";
      attrs[attrKey] = {
        type: "variable",
        value: `<${convertToVariantAvairableName(name)} ${nameToTag} />`,
      };
    }
  });
  return {
    type: tag,
    attrs: attrs,
  };
}
