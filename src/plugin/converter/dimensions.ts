import { convertToCssAvairableName } from "../../../packages/examples/src/code-writer/convertToCssAvairableName";
import { isMixed } from "../../../packages/web/src/utils";
import { colorToHex } from "../colorToHex";

export function supportedNodes(
  node: SceneNode
): node is
  | FrameNode
  | ComponentNode
  | ComponentSetNode
  | InstanceNode
  | TextNode {
  return (
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE" ||
    node.type === "TEXT"
  );
}

export function nodeToTailwindHtml(node: SceneNode, ctx: any = {}) {
  if (!supportedNodes(node)) return "";
  const classes = convertToClasses(node, ctx);
  if (node.type === "FRAME" || node.type === "COMPONENT") {
    const children = node.children.map((child) =>
      nodeToTailwindHtml(child, ctx)
    );
    return `<div class="${classes.join(" ")}">${children.join("")}</div>`;
  }

  if (node.type === "INSTANCE") {
    return handleInstanceNode(node);
  }

  if (node.type === "TEXT") {
    return `<div class="${classes.join(" ")}">${node.characters}</div>`;
  }
  return "";
}

export function convertToVariantAvairableName(name: string) {
  return name.replace(/[ #:]/g, "");
}

function handleInstanceNode(node: InstanceNode) {
  if (!node.mainComponent) {
    throw new Error("node.mainComponent is null");
  }

  const mainComponent = node.mainComponent;
  const tag = mainComponent.parent?.name;
  if (!tag) throw new Error("tag is null");

  let attrString: string[] = [];
  Object.entries(node.componentProperties).forEach(([key, value]) => {
    const attrKey = convertToVariantAvairableName(key);
    if (value.type === "TEXT") {
      attrString.push(`${attrKey}="${value.value}"`);
    } else if (value.type === "VARIANT") {
      if (value.value === "true" || value.value === "false") {
        attrString.push(`${attrKey}={${value.value}}`);
      } else {
        attrString.push(`${attrKey}="${value.value}"`);
      }
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

      const html = `${attrKey}={<${convertToVariantAvairableName(
        name
      )} ${nameToTag} />}`;
      attrString.push(html);
    }
  });
  return `<${tag}${
    attrString.length > 0 ? ` ${attrString.join(" ")}` : ""
  }></${tag}>`;
}

export function convertToClasses(node: SceneNode, ctx: any = {}) {
  if (!supportedNodes(node)) return [];
  const classes: string[] = [];

  // height
  if (node.layoutSizingVertical === "HUG") {
    classes.push("h-auto");
  } else if (node.layoutSizingVertical === "FIXED") {
    classes.push(`h-[${node.height}px]`);
  } else if (node.layoutSizingVertical === "FILL") {
    classes.push("h-full");
  }
  if (node.minHeight) {
    classes.push(`min-h-[${node.minHeight}px]`);
  }
  if (node.maxHeight) {
    classes.push(`max-h-[${node.maxHeight}px]`);
  }

  // width
  if (node.layoutSizingHorizontal === "HUG") {
    classes.push("w-auto");
  } else if (node.layoutSizingHorizontal === "FIXED") {
    classes.push(`w-[${node.width}px]`);
  } else if (node.layoutSizingHorizontal === "FILL") {
    classes.push("w-full");
  }
  if (node.minWidth) {
    classes.push(`min-w-[${node.minWidth}px]`);
  }
  if (node.maxWidth) {
    classes.push(`max-w-[${node.maxWidth}px]`);
  }

  if (node.type === "TEXT") {
    if (node.textAlignHorizontal === "LEFT") {
      classes.push("text-left");
    }
    if (node.textAlignHorizontal === "CENTER") {
      classes.push("text-center");
    }
    if (node.textAlignHorizontal === "RIGHT") {
      classes.push("text-right");
    }

    if (node.fontSize) {
      if (typeof node.fontSize === "number") {
        classes.push(`text-[${node.fontSize}px]`);
      }
    }

    if (node.lineHeight) {
      if (typeof node.lineHeight === "number") {
        classes.push(`leading-[${node.lineHeight}px]`);
      }
    }

    if (node.fontWeight) {
      if (typeof node.fontWeight === "number") {
        classes.push(`font-[${node.fontWeight}]`);
      }
    }

    if (node.fontName) {
      if (isMixed(node.fontName)) throw new Error("isMixed");
      classes.push(`font-${node.fontName.family}`);
    }
  } else {
    // position
    if (node.layoutPositioning === "ABSOLUTE") {
      classes.push("absolute");

      if (node.constraints.vertical === "MIN") {
        classes.push(`top-[${node.y}px]`);
      }
      if (node.constraints.vertical === "CENTER") {
        classes.push(`top-[${node.y}px]`);
      }
      if (node.constraints.vertical === "MAX") {
        const parent = node.parent;
        if (parent && "height" in parent && typeof parent.height === "number") {
          classes.push(`bottom-[${parent.height - node.y}px]`);
        }
      }

      if (node.constraints.horizontal === "MIN") {
        classes.push(`left-[${node.x}px]`);
      }
      if (node.constraints.horizontal === "CENTER") {
        classes.push(`left-[${node.x}px]`);
      }
      if (node.constraints.horizontal === "MAX") {
        const parent = node.parent;
        if (parent && "width" in parent && typeof parent.width === "number") {
          classes.push(`right-[${parent.width - node.x}px]`);
        }
      }
    } else {
      classes.push("relative");
    }

    if (node.layoutMode === "HORIZONTAL") {
      // display
      // flex-direction
      // justify-content
      // align-items
      classes.push("flex");
    } else if (node.layoutMode === "VERTICAL") {
      classes.push("flex");
      classes.push("flex-col");
    }
    if (node.primaryAxisAlignItems === "MIN") {
      classes.push("justify-start");
      if (node.counterAxisAlignItems === "MIN") {
        classes.push("items-start");
      }
      if (node.counterAxisAlignItems === "CENTER") {
        classes.push("items-center");
      }
      if (node.counterAxisAlignItems === "MAX") {
        classes.push("items-end");
      }
    }
    if (node.primaryAxisAlignItems === "CENTER") {
      classes.push("justify-center");
      if (node.counterAxisAlignItems === "MIN") {
        classes.push("items-start");
      }
      if (node.counterAxisAlignItems === "CENTER") {
        classes.push("items-center");
      }
      if (node.counterAxisAlignItems === "MAX") {
        classes.push("items-end");
      }
    }
    if (node.primaryAxisAlignItems === "MAX") {
      classes.push("justify-end");
      if (node.counterAxisAlignItems === "MIN") {
        classes.push("items-start");
      }
      if (node.counterAxisAlignItems === "CENTER") {
        classes.push("items-center");
      }
      if (node.counterAxisAlignItems === "MAX") {
        classes.push("items-end");
      }
    }
    if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
      classes.push("justify-between");
      if (node.counterAxisAlignItems === "MIN") {
        classes.push("items-start");
      }
      if (node.counterAxisAlignItems === "CENTER") {
        classes.push("items-center");
      }
      if (node.counterAxisAlignItems === "MAX") {
        classes.push("items-end");
      }
    }

    // padding
    if (node.paddingLeft) {
      classes.push(`pl-[${node.paddingLeft}px]`);
    }
    if (node.paddingRight) {
      classes.push(`pr-[${node.paddingRight}px]`);
    }
    if (node.paddingTop) {
      classes.push(`pt-[${node.paddingTop}px]`);
    }
    if (node.paddingBottom) {
      classes.push(`pb-[${node.paddingBottom}px]`);
    }

    // gap
    if (node.itemSpacing) {
      classes.push(`gap-[${node.itemSpacing}px]`);
    }

    // border-radius
    if (!isMixed(node.cornerRadius)) {
      classes.push(`rounded-[${node.cornerRadius}px]`);
    }
    if (node.topLeftRadius) {
      classes.push(`rounded-tl-[${node.topLeftRadius}px]`);
    }
    if (node.topRightRadius) {
      classes.push(`rounded-tr-[${node.topRightRadius}px]`);
    }
    if (node.bottomLeftRadius) {
      classes.push(`rounded-bl-[${node.bottomLeftRadius}px]`);
    }
    if (node.bottomRightRadius) {
      classes.push(`rounded-br-[${node.bottomRightRadius}px]`);
    }

    // border
    if (isMixed(node.strokes)) {
      throw new Error("isMixed strokes");
    }

    if (node.strokes.length === 1) {
      const stroke = node.strokes[0];
      if (stroke.type === "SOLID") {
        if (stroke.boundVariables?.color) {
          const id = stroke.boundVariables.color.id;
          const color = figma.variables.getVariableById(id);
          if (!id) throw new Error("id is null");
          if (!color) throw new Error("color is null");
          const name = convertToCssAvairableName(color.name);
          if (!ctx.colors) ctx.colors = {};
          if (color?.resolvedType === "COLOR") {
            ctx.colors[name] = color.id;
          }
          classes.push(`before:border-${name}`);
        } else {
          const hex = colorToHex(stroke.color, stroke.opacity ?? 1);
          classes.push(`before:border-[${hex}]`);
        }
      }

      if (isMixed(node.strokeWeight)) {
        throw new Error("isMixed strokeWeight");
      }

      if (node.strokeWeight) {
        classes.push(`before:border-[${node.strokeWeight}px]`);
      }

      if (node.strokeAlign !== "INSIDE") {
        throw new Error("strokeAlign !== 'INSIDE'");
      }

      if (
        node.strokeBottomWeight ||
        node.strokeTopWeight ||
        node.strokeLeftWeight ||
        node.strokeRightWeight
      ) {
        classes.push("before:content-''");
        classes.push("before:absolute");
        classes.push("before:inset-0");
        classes.push("before:w-full");
        classes.push("before:h-full");
      }

      if (node.strokeBottomWeight) {
        classes.push(`before:border-b-[${node.strokeBottomWeight}px]`);
      }
      if (node.strokeTopWeight) {
        classes.push(`before:border-t-[${node.strokeTopWeight}px]`);
      }
      if (node.strokeLeftWeight) {
        classes.push(`before:border-l-[${node.strokeLeftWeight}px]`);
      }
      if (node.strokeRightWeight) {
        classes.push(`before:border-r-[${node.strokeRightWeight}px]`);
      }

      classes
        .filter((c) => c.startsWith("rounded-"))
        .forEach((c) => {
          classes.push(`before:${c}`);
        });
    }

    // shadow
    if (isMixed(node.effects)) {
      throw new Error("isMixed effects");
    }
    if (node.effects.length === 1) {
      const effect = node.effects[0];
      if (effect.type === "DROP_SHADOW") {
        const hex = colorToHex(effect.color, effect.color.a ?? 1);
        classes.push(
          `shadow-[${effect.offset.x}px_${effect.offset.y}px_${
            effect.radius
          }px_${effect.spread ?? 0}_${hex}]`
        );
      }
    }
  }

  // background
  // color
  if (node.fillStyleId) {
    if (isMixed(node.fillStyleId)) throw new Error("isMixed");
    ctx.colors = ctx.colors ?? {};
    const name = convertToCssAvairableName(node.fillStyleId);
    ctx.colors[name] = node.fillStyleId;
    classes.push(`bg-${name}`);
  } else {
    if (isMixed(node.fills)) throw new Error("isMixed");
    if (node.fills.length === 1) {
      const fill = node.fills[0];
      if (fill.type === "SOLID") {
        if (fill.boundVariables?.color) {
          const id = fill.boundVariables.color.id;
          const color = figma.variables.getVariableById(id);
          if (!id) throw new Error("id is null");
          if (!color) throw new Error("color is null");
          const name = convertToCssAvairableName(color.name);
          if (!ctx.colors) ctx.colors = {};
          if (color?.resolvedType === "COLOR") {
            ctx.colors[name] = color.id;
          }
          if (node.type === "TEXT") {
            classes.push(`text-${name}`);
          } else {
            classes.push(`bg-${name}`);
          }
        } else {
          const hex = colorToHex(fill.color, fill.opacity ?? 1);
          if (node.type === "TEXT") {
            classes.push(`text-[${hex}]`);
          } else {
            classes.push(`bg-[${hex}]`);
          }
        }
      }
    }
  }

  return classes;
}
