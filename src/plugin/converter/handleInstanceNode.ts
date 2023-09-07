import { Context, convertToVariantAvairableName } from "./figmaNodeToDomNode";
import { AttrValue } from "./AttrValue";
import { DomNode } from "./DomNode";
import { parseDomName } from "../initFigmaPlugin";

export function handleInstanceNode(node: InstanceNode, ctx: Context): DomNode {
  if (!node.mainComponent) {
    throw new Error("node.mainComponent is null");
  }
  if (node.componentPropertyReferences?.mainComponent) {
    for (const key in ctx.root.componentPropertyDefinitions) {
      if (node.componentPropertyReferences.mainComponent === key) {
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(key)] = {
          type: "INSTANCE",
          defaultValue: node.mainComponent.id,
        };
        return {
          type: "text",
          value: `{props.${convertToVariantAvairableName(key)}}`,
        };
      }
    }
  }

  const mainComponent = node.mainComponent;
  if (!mainComponent) throw new Error("mainComponent is null");
  if (!mainComponent.parent) throw new Error("mainComponent.parent is null");
  const tag = parseDomName(mainComponent.parent?.name).name;
  if (!tag) throw new Error("tag is null");
  ctx.dependencies = ctx.dependencies ?? {};
  ctx.dependencies[tag] = "INSTANCE";

  const attrs: Record<string, AttrValue> = {};
  Object.entries(node.componentProperties).forEach(([key, value]) => {
    const attrKey = convertToVariantAvairableName(key);
    if (value.type === "TEXT") {
      attrs[attrKey] = {
        type: "value",
        value: value.value.toString(),
      };
    } else if (value.type === "VARIANT") {
      const componentSet = node.mainComponent?.parent as
        | ComponentSetNode
        | undefined;
      if (!componentSet) throw new Error("componentSet is null");
      const variant = componentSet.variantGroupProperties[attrKey];
      if (variant && variant.values.length > 1) {
        attrs[attrKey] = { value: value.value.toString(), type: "value" };
      }
    } else if (value.type === "INSTANCE_SWAP") {
      if (typeof value.value === "boolean") {
        throw new Error("value.value is boolean");
      }
      const component = figma.getNodeById(value.value);
      if (!component) throw new Error("component is null");
      const name = component.parent?.name;
      if (!name) throw new Error("name is null");

      const componentSet = component.parent as ComponentSetNode | undefined;
      if (!componentSet) throw new Error("componentSet is null");

      const nameToTag = component.name
        .split(",")
        .map((x) => {
          const sp = x.split("=");
          const variant = componentSet.variantGroupProperties[sp[0]];
          if (!variant) return "";
          if (variant.values.length <= 1) return "";
          return `${convertToVariantAvairableName(sp[0])}="${sp[1]}"`;
        })
        .join(" ");

      ctx.dependencies = ctx.dependencies ?? {};
      ctx.dependencies[name] = "INSTANCE";
      attrs[attrKey] = {
        type: "variable",
        value: `<${name} ${nameToTag} />`,
      };
    }
  });
  const domName = parseDomName(node.name);
  if (domName.meta.attributes.length > 0) {
    domName.meta.attributes.forEach((attr) => {
      attrs[attr] = {
        type: "variable",
        value: `props.${convertToVariantAvairableName(attr)}`,
      };
    });
  }

  return {
    type: tag,
    attrs: attrs,
  };
}
