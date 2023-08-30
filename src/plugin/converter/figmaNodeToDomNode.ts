import { colorToHex } from "../colorToHex";
import { DomNode } from "./DomNode";
import { TextDomNode } from "./TextDomNode";
import { TextDecoder } from "./TextDecoder";
import { handleInstanceNode } from "./handleInstanceNode";
import { supportedNodes } from "./supportedNodes";
import { variantToProps } from "./variantToProps";
export function isMixed(mixed: any): mixed is typeof figma.mixed {
  if (typeof figma === "undefined") {
    return false;
  }
  return mixed === figma.mixed;
}

export function removeHyphen(name: string) {
  return name.replace(/-/g, "");
}

export function convertToCssAvairableName(name: string) {
  return removeHyphen(name.replace(/[^a-zA-Z0-9-]/g, "-"));
}

export async function figmaNodeToDomNode(
  node: SceneNode,
  ctx: any
): Promise<DomNode | null> {
  if (!ctx.depth) ctx.depth = 0;
  if (node.parent?.type === "COMPONENT_SET") {
    ctx.props = {
      ...variantToProps(node.parent),
    };
  }
  if (!supportedNodes(node)) return null;
  if (!node.visible) {
    return {
      type: "div",
      attrs: {
        class: "hidden",
      },
    };
  }
  ctx.depth++;
  const classes = await convertToClasses(node, ctx);
  ctx.depth--;
  const ignoreInstance =
    node.type === "INSTANCE" && ctx.ignoreInstance === true;
  if (node.type === "VECTOR") {
    const res = await node.exportAsync({ format: "SVG" });
    const svg = new TextDecoder("utf-8").decode(res);
    return {
      type: "div",
      children: [
        {
          type: "text",
          value: svg,
          valueType: "string",
        },
      ],
    };
  }
  if (node.type === "FRAME" || node.type === "COMPONENT" || ignoreInstance) {
    const img = classes.find((c) => c.startsWith("img="));
    if (img) {
      return {
        type: "img",
        attrs: {
          src: img.replace("img=", ""),
          class: classes.join(" "),
        },
      };
    }
    ctx.depth++;
    const childrenPromises = node.children.map(
      async (child) => await figmaNodeToDomNode(child, ctx)
    );
    const children = (await Promise.all(childrenPromises)).filter(
      (x) => x !== null
    ) as DomNode[];
    ctx.depth--;
    const joinedClasses = classes.join(" ");
    return {
      type: "div",
      attrs: {
        class: joinedClasses,
      },
      children: children,
    };
  }

  if (node.type === "INSTANCE") {
    ctx.depth++;
    const r = handleInstanceNode(node, ctx);
    ctx.depth--;
    return r;
  }

  if (node.type === "TEXT") {
    if (node.componentPropertyReferences?.characters) {
      for (const key in ctx.root.componentPropertyDefinitions) {
        if (node.componentPropertyReferences.characters === key) {
          ctx.props = ctx.props ?? {};
          ctx.props[convertToVariantAvairableName(key)] = "TEXT";
          return {
            type: "div",
            attrs: {
              class: classes.join(" "),
            },
            children: [
              {
                type: "text",
                value: `{props.${convertToVariantAvairableName(key)}}`,
                valueType: "variable",
              },
            ],
          };
          //   return `${indent}<div class="${classes.join(
          //     " "
          //   )}">\n${childIndent}{props.${convertToVariantAvairableName(
          //     key
          //   )}}\n${indent}</div>\n`;
        }
      }
    }
    return {
      type: "div",
      attrs: {
        class: classes.join(" "),
      },
      children: [
        {
          type: "text",
          value: node.characters,
          valueType: "string",
        },
      ],
    };
    // return `${indent}<div class="${classes.join(" ")}">\n${childIndent}${
    //   node.characters
    // }\n${indent}</div>\n`;
  }
  return null;
  //   return "";
}

export function convertToVariantAvairableName(name: string) {
  return name.replace(/[ #:]/g, "");
}

export function isTextDomNode(node: DomNode): node is TextDomNode {
  return node.type === "text";
}

export async function convertToClasses(node: SceneNode, ctx: any = {}) {
  if (!supportedNodes(node)) return [];
  const classes: string[] = [];

  // height
  if (node.layoutSizingVertical === "HUG") {
    classes.push("h-fit");
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
    classes.push("w-fit");
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
          classes.push(`right-[${parent.width - node.x - node.width}px]`);
        }
      }
    } else {
      classes.push("relative");
    }

    if (node.type !== "VECTOR") {
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
      // https://www.figma.com/plugin-docs/api/properties/nodes-layoutwrap/
      if (node.layoutWrap === "WRAP" && node.layoutMode === "HORIZONTAL") {
        classes.push("flex-wrap");
        classes.push("[&>*]:flex-1");
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

      if (!isMixed(node.strokeWeight) && node.strokeWeight) {
        classes.push(`before:border-[${node.strokeWeight}px]`);
      }

      if (node.strokeAlign !== "INSIDE") {
        throw new Error("strokeAlign !== 'INSIDE'");
      }

      if (node.type !== "VECTOR") {
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

  if (node.type !== "VECTOR") {
    // background
    // color
    if (node.fillStyleId) {
      if (isMixed(node.fillStyleId)) throw new Error("isMixed fillStyleId");
      ctx.colors = ctx.colors ?? {};
      const name = convertToCssAvairableName(node.fillStyleId);
      ctx.colors[name] = node.fillStyleId;
      const color = figma.getStyleById(node.fillStyleId);
      if (!color) throw new Error("color is null");
      if (color.type === "PAINT") {
        const paint = color as PaintStyle;
        const paints = paint.paints;
        if (paints.length === 1) {
          const paint = paints[0];
          if (paint.type === "GRADIENT_LINEAR") {
            classes.push(`bg-gradient-to-br`);
            classes.push(`from-red-500`);
            classes.push(`to-blue-500`);
          } else {
            classes.push(`bg-${name}`);
          }
        }
      }
    } else {
      if (isMixed(node.fills)) throw new Error("isMixed fills");
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
        } else if (fill.type === "IMAGE") {
          if (fill.imageHash) {
            const res = await figma
              .getImageByHash(fill.imageHash)
              ?.getBytesAsync();
            ctx.images = ctx.images ?? {};
            ctx.images[fill.imageHash] = res;
            classes.push(`img=${fill.imageHash}`);
          }
        }
      }
    }
  }

  return classes;
}
