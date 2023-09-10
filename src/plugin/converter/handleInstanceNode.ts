import {
  convertToVariantAvairableName,
  isTextDomNode,
} from "./figmaNodeToDomNode";
import { Context } from "../types/Context";
import { AttrType, AttrValue } from "../types/AttrValue";
import { DomNode } from "../types/DomNode";
import { parseDomName } from "./parseDomName";

export function handleInstanceNode(
  node: InstanceNode,
  ctx: Context,
  ignoreInstance = false
): DomNode {
  if (!node.mainComponent) {
    throw new Error("node.mainComponent is null");
  }
  if (node.componentPropertyReferences?.mainComponent) {
    for (const key in ctx.root.componentPropertyDefinitions) {
      if (node.componentPropertyReferences.mainComponent === key) {
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(key)] = {
          type: {
            type: "INSTANCE",
          },
          defaultValue: node.mainComponent.id,
        };
        return {
          type: "text",
          value: convertToVariantAvairableName(key),
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
        type: AttrType.VALUE,
        value: value.value.toString(),
      };
    } else if (value.type === "VARIANT") {
      const componentSet = node.mainComponent?.parent as
        | ComponentSetNode
        | undefined;
      if (!componentSet) throw new Error("componentSet is null");
      const variant = componentSet.variantGroupProperties[key];
      if (variant && variant.values.length > 1) {
        attrs[attrKey] = {
          value: value.value.toString(),
          type: AttrType.VALUE,
        };
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

      const id = findComponentPropertyReferences(node, key);
      ctx.dependencies = ctx.dependencies ?? {};
      ctx.dependencies[name] = "INSTANCE";
      if (id) {
        const z = handleInstanceNode(id, ctx, ignoreInstance);
        // Object.keys(id.componentProperties).forEach((key) => {
        //   const prop = id.componentProperties[key];
        //   if (prop.type === "INSTANCE_SWAP") {
        //     const node = figma.getNodeById(prop.value.toString());
        //     if (node) {
        //       subAttrs[convertToVariantAvairableName(key)] = {
        //         type: "variable",
        //         value: `<${node.parent?.name} />`,
        //       };
        //       ctx.dependencies = ctx.dependencies ?? {};
        //       ctx.dependencies[node.parent?.name ?? ""] = "INSTANCE";
        //     }
        //   } else {
        //     subAttrs[key] = {
        //       type: "value",
        //       value: prop.value.toString(),
        //     };
        //   }
        // });
        if (isTextDomNode(z)) {
          throw new Error("z is text");
        }
        attrs[convertToVariantAvairableName(key)] = {
          type: AttrType.VARIABLE,
          value: `<${z.type} ${Object.entries(z.attrs ?? {})
            .map(([key, value]) => {
              if (value.type === "variable") {
                return `${key}={${value.value}}`;
              } else {
                return `${key}="${value.value}"`;
              }
            })
            .join(" ")} />`,
        };
      }

      // component.name.split(",").map((x) => {
      //   const sp = x.split("=");
      //   const variant = componentSet.variantGroupProperties[sp[0]];
      //   if (!variant) return "";
      //   if (variant.values.length <= 1) return "";
      //   subAttrs[sp[0]] = {
      //     type: "value",
      //     value: sp[1],
      //   };
      // return `${convertToVariantAvairableName(sp[0])}="${sp[1]}"`;
      // });

      // attrs[attrKey] = {
      //   type: "variable",
      //   value: `<${name} ${Object.entries(subAttrs)
      //     .map(([key, value]) => {
      //       if (value.type === "variable") {
      //         return `${key}={${value.value}}`;
      //       } else {
      //         return `${key}="${value.value}"`;
      //       }
      //     })
      //     .join(" ")} />`,
      // };
    }
  });
  const domName = parseDomName(node.name);
  if (domName.meta.attributes.length > 0) {
    domName.meta.attributes.forEach((attr) => {
      attrs[attr.key] = {
        type: AttrType.VARIABLE,
        value: convertToVariantAvairableName(attr.value),
      };
    });
  }

  return {
    type: tag,
    attrs: attrs,
  };
}

function findComponentPropertyReferences(
  node: SceneNode,
  key: string
): InstanceNode | null {
  if (node.componentPropertyReferences?.mainComponent === key) {
    return node as InstanceNode;
  }
  if ("children" in node) {
    for (const child of node.children) {
      const id = findComponentPropertyReferences(child, key);
      if (id) return id;
    }
  }

  return null;
}
