import { colorToHex } from "../utils/colorToHex";
import { supportedNodes } from "./supportedNodes";
import { isMixed } from "../utils/isMixed";
import { convertToCssAvairableName } from "./convertToCssAvairableName";
import { Context } from "../types/Context";
import { Properties } from "../types/Properties";
import { DEFAULT_MODE } from "./html-css/toCssStyleText";

type ErrorInfo = {
  name: string;
  context: string;
  where: string;
};

class UnsupportedError extends Error {
  constructor(info: ErrorInfo) {
    super(JSON.stringify(info));
  }
}

class UnexpectedError extends Error {
  constructor(info: ErrorInfo) {
    super(JSON.stringify(info));
  }
}

export async function convertToCssProperties(node: SceneNode, ctx: Context) {
  if (!supportedNodes(node)) return null;
  const props: Partial<Properties> = {};

  props.boxSizing = "border-box";

  // height
  if (node.layoutSizingVertical === "HUG") {
    props.height = "fit";
  } else if (node.layoutSizingVertical === "FIXED") {
    props.height = node.height;
  } else if (node.layoutSizingVertical === "FILL") {
    props.height = "full";
  }
  if (node.minHeight) {
    props.minHeight = node.minHeight;
  }
  if (node.maxHeight) {
    props.maxHeight = node.maxHeight;
  }

  // width
  if (node.layoutSizingHorizontal === "HUG") {
    props.width = "fit";
  } else if (node.layoutSizingHorizontal === "FIXED") {
    props.width = node.width;
  } else if (node.layoutSizingHorizontal === "FILL") {
    props.width = "full";
  }
  if (node.minWidth) {
    props.minWidth = node.minWidth;
  }
  if (node.maxWidth) {
    props.maxWidth = node.maxWidth;
  }

  if (node.type === "TEXT") {
    if (node.textAlignHorizontal === "LEFT") {
      props.textAlign = "left";
    }
    if (node.textAlignHorizontal === "CENTER") {
      props.textAlign = "center";
    }
    if (node.textAlignHorizontal === "RIGHT") {
      props.textAlign = "right";
    }

    if (node.fontSize) {
      if (typeof node.fontSize === "number") {
        props.fontSize = node.fontSize;
      }
    }

    if (node.lineHeight) {
      if (typeof node.lineHeight === "number") {
        props.lineHeight = node.lineHeight;
      }
      if (!isMixed(node.lineHeight)) {
        if (node.lineHeight.unit === "PIXELS") {
          props.lineHeight = node.lineHeight.value;
        } else if (node.lineHeight.unit === "AUTO") {
          if (isMixed(node.fontSize)) {
            throw new UnsupportedError({
              name: "fontSize is figma.mixed",
              context: "convertToCssProperties",
              where: node.name,
            });
          }
          const h = Math.round(node.fontSize * 1.2);
          props.lineHeight = h;
        }
      } else {
        if (isMixed(node.lineHeight)) {
          throw new UnsupportedError({
            name: "lineHeight is figma.mixed",
            context: "convertToCssProperties",
            where: node.name,
          });
        }
      }
    }

    if (node.fontWeight) {
      if (typeof node.fontWeight === "number") {
        props.fontWeight = node.fontWeight;
      }
    }

    if (node.fontName) {
      if (isMixed(node.fontName)) {
        throw new UnsupportedError({
          name: "fontName is figma.mixed",
          context: "convertToCssProperties",
          where: node.name,
        });
      }
    }
  } else {
    // position
    if (node.layoutPositioning === "ABSOLUTE") {
      props.position = "absolute";
      if (node.constraints.vertical === "MIN") {
        props.top = node.y;
      }
      if (node.constraints.vertical === "CENTER") {
        props.top = node.y;
      }
      if (node.constraints.vertical === "MAX") {
        const parent = node.parent;
        if (parent && "height" in parent && typeof parent.height === "number") {
          props.bottom = parent.height - node.y;
        }
      }

      if (node.constraints.horizontal === "MIN") {
        props.left = node.x;
      }
      if (node.constraints.horizontal === "CENTER") {
        props.left = node.x;
      }
      if (node.constraints.horizontal === "MAX") {
        const parent = node.parent;
        if (parent && "width" in parent && typeof parent.width === "number") {
          props.right = parent.width - node.x - node.width;
        }
      }
    } else {
      props.position = "relative";
    }

    if (node.type !== "VECTOR") {
      if (node.layoutMode === "HORIZONTAL") {
        // display
        // flex-direction
        // justify-content
        // align-items
        props.display = "flex";
      } else if (node.layoutMode === "VERTICAL") {
        props.display = "flex";
        props.flexDirection = "column";
      }
      // https://www.figma.com/plugin-docs/api/properties/nodes-layoutwrap/
      if (node.layoutWrap === "WRAP" && node.layoutMode === "HORIZONTAL") {
        // classes.push("flex-wrap");
        // classes.push("[&>*]:flex-1");
        // should use grid ?
        // display: grid;
        // grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
      }

      if (node.primaryAxisAlignItems === "MIN") {
        props.justifyContent = "start";
        if (node.counterAxisAlignItems === "MIN") {
          props.alignItems = "start";
        }
        if (node.counterAxisAlignItems === "CENTER") {
          props.alignItems = "center";
        }
        if (node.counterAxisAlignItems === "MAX") {
          props.alignItems = "end";
        }
      }
      if (node.primaryAxisAlignItems === "CENTER") {
        props.justifyContent = "center";
        if (node.counterAxisAlignItems === "MIN") {
          props.alignItems = "start";
        }
        if (node.counterAxisAlignItems === "CENTER") {
          props.alignItems = "center";
        }
        if (node.counterAxisAlignItems === "MAX") {
          props.alignItems = "end";
        }
      }
      if (node.primaryAxisAlignItems === "MAX") {
        props.justifyContent = "end";
        if (node.counterAxisAlignItems === "MIN") {
          props.alignItems = "start";
        }
        if (node.counterAxisAlignItems === "CENTER") {
          props.alignItems = "center";
        }
        if (node.counterAxisAlignItems === "MAX") {
          props.alignItems = "end";
        }
      }
      if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
        props.justifyContent = "between";
        if (node.counterAxisAlignItems === "MIN") {
          props.alignItems = "start";
        }
        if (node.counterAxisAlignItems === "CENTER") {
          props.alignItems = "center";
        }
        if (node.counterAxisAlignItems === "MAX") {
          props.alignItems = "end";
        }
      }

      // padding
      if (node.paddingLeft) {
        props.paddingLeft = node.paddingLeft;
      }
      if (node.paddingRight) {
        props.paddingRight = node.paddingRight;
      }
      if (node.paddingTop) {
        props.paddingTop = node.paddingTop;
      }
      if (node.paddingBottom) {
        props.paddingBottom = node.paddingBottom;
      }

      // gap
      if (node.itemSpacing) {
        props.gap = node.itemSpacing;
      }

      // border-radius
      if (!isMixed(node.cornerRadius)) {
        props.borderTopLeftRadius = node.cornerRadius;
        props.borderTopRightRadius = node.cornerRadius;
        props.borderBottomLeftRadius = node.cornerRadius;
        props.borderBottomRightRadius = node.cornerRadius;
      }
      if (node.topLeftRadius) {
        props.borderTopLeftRadius = node.topLeftRadius;
      }
      if (node.topRightRadius) {
        props.borderTopRightRadius = node.topRightRadius;
      }
      if (node.bottomLeftRadius) {
        props.borderBottomLeftRadius = node.bottomLeftRadius;
      }
      if (node.bottomRightRadius) {
        props.borderBottomRightRadius = node.bottomRightRadius;
      }
    }

    // border
    if (isMixed(node.strokes)) {
      throw new UnsupportedError({
        name: "strokes is figma.mixed",
        context: "convertToCssProperties",
        where: node.name,
      });
    }

    if (node.strokes.length === 1) {
      const stroke = node.strokes[0];
      if (stroke.type === "SOLID") {
        if (stroke.boundVariables?.color) {
          const id = stroke.boundVariables.color.id;
          const color = figma.variables.getVariableById(id);

          if (!color) {
            throw new UnexpectedError({
              name: "figma.variables.getVariableById(id) is null",
              context: "convertToCssProperties, strokes",
              where: `nodeName: ${node.name}, variableId: ${id}`,
            });
          }
          const name = convertToCssAvairableName(color.id);

          props.borderColor = name;
        } else {
          const hex = colorToHex(stroke.color, stroke.opacity ?? 1);
          props.borderColor = hex;
        }
      }

      if (!isMixed(node.strokeWeight) && node.strokeWeight) {
        props.borderTopWidth = node.strokeWeight;
        props.borderRightWidth = node.strokeWeight;
        props.borderBottomWidth = node.strokeWeight;
        props.borderLeftWidth = node.strokeWeight;
      }

      if (node.strokeAlign !== "INSIDE") {
        throw new UnsupportedError({
          name: "strokeAlign only support INSIDE",
          context: "convertToCssProperties",
          where: node.name,
        });
      }

      if (node.type !== "VECTOR") {
        if (node.strokeBottomWeight) {
          props.borderBottomWidth = node.strokeBottomWeight;
        }
        if (node.strokeTopWeight) {
          props.borderTopWidth = node.strokeTopWeight;
        }
        if (node.strokeLeftWeight) {
          props.borderLeftWidth = node.strokeLeftWeight;
        }
        if (node.strokeRightWeight) {
          props.borderRightWidth = node.strokeRightWeight;
        }
      }
    }

    // shadow
    if (isMixed(node.effects)) {
      throw new UnsupportedError({
        name: "effects is figma.mixed",
        context: "convertToCssProperties",
        where: node.name,
      });
    }
    if (node.effects.length === 1) {
      const effect = node.effects[0];
      if (effect.type === "DROP_SHADOW") {
        const hex = colorToHex(effect.color, effect.color.a ?? 1);
        props.boxShadow = `${effect.offset.x}px ${effect.offset.y}px ${
          effect.radius
        }px ${effect.spread ?? 0}px ${hex}`;
      }
    }
  }

  // background
  // color
  if (node.fillStyleId) {
    if (isMixed(node.fillStyleId)) throw new Error("isMixed fillStyleId");
    const name = convertToCssAvairableName(node.fillStyleId);
    const color = figma.getStyleById(node.fillStyleId);
    if (!color) {
      throw new UnexpectedError({
        name: "figma.getStyleById(node.fillStyleId) is null",
        context: "convertToCssProperties, fillStyleId",
        where: `nodeName: ${node.name}, styleId: ${node.fillStyleId}`,
      });
    }

    if (color.type === "PAINT") {
      const paint = color as PaintStyle;
      const paints = paint.paints;
      if (paints.length === 1) {
        const paint = paints[0];
        if (paint.type === "GRADIENT_LINEAR") {
          throw new UnsupportedError({
            name: "GRADIENT_LINEAR is not supported",
            context: "convertToCssProperties",
            where: node.name,
          });
          // props.backgroundColor = "linear-gradient(to right bottom, #000000, #ffffff)";
        } else if (paint.type === "SOLID") {
          if (node.type === "TEXT") {
            props.color = name;
          } else {
            props.backgroundColor = name;
          }
          ctx.colors?.push({
            id: name,
            name,
            value: colorToHex(paint.color, paint.opacity ?? 1),
            mode: DEFAULT_MODE,
          });
        }
      }
    }
  } else {
    if (isMixed(node.fills)) {
      if (node.type !== "VECTOR") {
        throw new UnsupportedError({
          name: "fills is figma.mixed",
          context: "convertToCssProperties",
          where: node.name,
        });
      }
    }
    if (!isMixed(node.fills) && node.fills.length === 1) {
      const fill = node.fills[0];
      if (fill.type === "SOLID") {
        if (fill.boundVariables?.color) {
          const id = fill.boundVariables.color.id;
          const color = figma.variables.getVariableById(id);
          if (!color) {
            throw new UnexpectedError({
              name: "figma.variables.getVariableById(id) is null",
              context: "convertToCssProperties, fills",
              where: `nodeName: ${node.name}, variableId: ${id}`,
            });
          }
          const name = convertToCssAvairableName(color.id);

          if (node.type === "TEXT" || node.type === "VECTOR") {
            props.color = name;
          } else {
            props.backgroundColor = name;
          }
        } else {
          const hex = colorToHex(fill.color, fill.opacity ?? 1);
          if (node.type === "TEXT" || node.type === "VECTOR") {
            props.color = hex;
          } else {
            props.backgroundColor = hex;
          }
        }
      } else if (fill.type === "IMAGE") {
        if (fill.imageHash) {
          const res = await figma
            .getImageByHash(fill.imageHash)
            ?.getBytesAsync();
          ctx.images = ctx.images ?? {};
          if (res) {
            ctx.images[fill.imageHash] = res;
          }
          ctx.props = ctx.props ?? {};
          //`https://picsum.photos/seed/${fill.imageHash}/200/300`,
        }
      }
    }
  }

  return props;
}
