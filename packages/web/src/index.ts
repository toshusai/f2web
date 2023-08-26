import { toCamelCase } from "js-convert-case";

import { isMixed, isRectangleCornerMixin } from "./utils";
import {
  Align,
  DimensionPorps,
  FillProps,
  Layout,
  LayoutProps,
  Size,
  StrokeProps,
} from "../../core/src";

export type WebNode = {
  children?: WebNode[];
  props:
    | (FillProps & LayoutProps & DimensionPorps & StrokeProps)
    | TextPropsBridge;
  type: "Frame" | "Text";
};

type TextPropsBridge = {
  text?: string | (() => string);
  fontSize?: number;
  lineHeight?: number;
  fontStyle?: "normal" | "italic" | "oblique" | "bold";
  fontWeight?: number | string;
} & DimensionPorps &
  FillProps;

export function figmaNode2WebNode(
  node: FrameNode | InstanceNode | TextNode
): WebNode {
  if (node.type === "TEXT") {
    const props: TextPropsBridge = {
      text: (() => {
        if (node.componentPropertyReferences?.characters) {
          return () =>
            `props.${toCamelCase(
              node.componentPropertyReferences!.characters!.split("#")[0]
            )}`;
        }
        if (node.characters === undefined) return "";
        return node.characters;
      })(),
      lineHeight: (() => {
        if (node.lineHeight === undefined) return undefined;
        if (isMixed(node.lineHeight)) return undefined;
        if (node.lineHeight.unit === "AUTO" && !isMixed(node.fontSize))
          return node.fontSize * 1.2;
        if (node.lineHeight.unit === "PIXELS") {
          return node.lineHeight.value;
        }
      })(),
      fontSize: (() => {
        if (node.fontSize === undefined) return undefined;
        if (typeof node.fontSize === "number") return node.fontSize;
        return undefined;
      })(),
      fillColor: (() => {
        if (isMixed(node.fills)) return undefined;
        if (node.fills.length === 0) return undefined;
        const fill = node.fills[0];
        if (fill.type === "SOLID") {
          return `rgba(${fill.color.r * 255},${fill.color.g * 255},${
            fill.color.b * 255
          },${fill.opacity})`;
        }
        return undefined;
      })(),
      fontWeight: (() => {
        if (node.fontName === undefined) return undefined;
        if (isMixed(node.fontName)) return undefined;
        if (node.fontName.style === "BOLD") return 700;
        if (node.fontWeight === 400) return 400;
        if (node.fontWeight === 700) return 700;
        return undefined;
      })(),

      fontStyle: (() => {
        if (node.fontName === undefined) return undefined;
        if (isMixed(node.fontName)) return undefined;
        if (node.fontName.style === "Italic") return "italic";
        return undefined;
      })() as "normal" | "italic" | "oblique" | "bold",
    };
    return {
      props,
      type: "Text",
    };
  } else {
    const props: FillProps & LayoutProps & DimensionPorps & StrokeProps = {
      width: (() => {
        if (
          node.layoutAlign === "STRETCH" &&
          node.primaryAxisSizingMode != "AUTO"
        ) {
          return Size.Fill;
        }
        if (node.layoutSizingHorizontal === "FIXED") {
          return node.width;
        }
        return Size.Hug;
      })(),
      maxWidth: node.maxWidth ?? undefined,
      minWidth: (() => {
        if (node.minWidth !== null) return node.minWidth;
        if (node.layoutSizingHorizontal === "FIXED") {
          return node.width;
        }
        return undefined;
      })(),
      height: (() => {
        if (
          node.parent &&
          "layoutMode" in node.parent &&
          node.parent.layoutMode === "VERTICAL" &&
          node.layoutGrow === 1 &&
          node.layoutAlign === "STRETCH"
        ) {
          return Size.Fill;
        }
        if (node.layoutSizingVertical === "FIXED") {
          return node.height;
        }
        return Size.Hug;
      })(),
      maxHeight: node.maxHeight ?? undefined,
      minHeight: (() => {
        if (node.minHeight !== null) return node.minHeight;
        if (node.layoutSizingVertical === "FIXED") {
          return node.height;
        }
        return undefined;
      })(),
      paddingLeft: node.paddingLeft !== 0 ? node.paddingLeft : undefined,
      paddingRight: node.paddingRight !== 0 ? node.paddingRight : undefined,
      paddingTop: node.paddingTop !== 0 ? node.paddingTop : undefined,
      paddingBottom: node.paddingBottom !== 0 ? node.paddingBottom : undefined,
      top: (() => {
        if (node.layoutPositioning === "ABSOLUTE") {
          if (node.constraints.vertical === "MIN") {
            return node.y;
          }
        }
        return undefined;
      })(),
      bottom: (() => {
        if (
          node.layoutPositioning === "ABSOLUTE" &&
          node.constraints.vertical === "MAX" &&
          // node.parent !== undefined &&
          isRectangleCornerMixin(node.parent)
        ) {
          return node.parent.height - node.y - node.height;
        }
        return undefined;
      })(),
      left: (() => {
        if (
          node.layoutPositioning === "ABSOLUTE" &&
          node.constraints.horizontal === "MIN"
        ) {
          return node.x;
        }
        return undefined;
      })(),
      right: (() => {
        if (
          node.layoutPositioning === "ABSOLUTE" &&
          node.constraints.horizontal === "MAX" &&
          // node.parent !== undefined &&
          isRectangleCornerMixin(node.parent)
        ) {
          return node.parent.width - node.x - node.width;
        }
        return undefined;
      })(),
      borderRadius: (() => {
        if (node.cornerRadius === 0) return undefined;
        if (typeof node.cornerRadius === "number") return node.cornerRadius;
        return undefined;
      })(),
      overflow: (() => {
        if (node.clipsContent) return "hidden";
        return undefined;
      })() as "hidden" | "scroll" | "auto" | undefined,

      layout: (() => {
        if (node.layoutMode === "HORIZONTAL") {
          return Layout.Horizontal;
        }
        if (node.layoutMode === "VERTICAL") {
          return Layout.Vertical;
        }
        return undefined;
      })(),
      align: (() => {
        if (node.layoutMode === "HORIZONTAL") {
          if (node.primaryAxisAlignItems === "MIN") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.TopLeft;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.Left;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.BottomLeft;
            }
          }
          if (node.primaryAxisAlignItems === "CENTER") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.TopCenter;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.Center;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.BottomCenter;
            }
          }
          if (node.primaryAxisAlignItems === "MAX") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.TopRight;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.Right;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.BottomRight;
            }
          }
          if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.TopBetween;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.CenterBetween;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.BottomBetween;
            }
          }
        }
        if (node.layoutMode === "VERTICAL") {
          if (node.primaryAxisAlignItems === "MIN") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.TopLeft;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.TopCenter;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.TopRight;
            }
          }
          if (node.primaryAxisAlignItems === "CENTER") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.Left;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.Center;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.Right;
            }
          }
          if (node.primaryAxisAlignItems === "MAX") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.BottomLeft;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.BottomCenter;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.BottomRight;
            }
          }
          if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
            if (node.counterAxisAlignItems === "MIN") {
              return Align.LeftBetween;
            }
            if (node.counterAxisAlignItems === "CENTER") {
              return Align.CenterBetween;
            }
            if (node.counterAxisAlignItems === "MAX") {
              return Align.RightBetween;
            }
          }
        }
      })(),
      gap: (() => {
        return node.itemSpacing;
      })(),
      fillColor: (() => {
        if (isMixed(node.fills)) return undefined;
        if (node.fills.length === 0) return undefined;
        const fill = node.fills[0];
        if (fill.type === "SOLID") {
          return `rgba(${fill.color.r * 255},${fill.color.g * 255},${
            fill.color.b * 255
          },${fill.opacity})`;
        }
        return undefined;
      })(),
      src: (() => {
        if (isMixed(node.fills)) return undefined;
        if (node.fills.length === 0) return undefined;
        const fill = node.fills[0];
        if (fill.type === "IMAGE" && fill.imageHash !== null) {
          return `props.$${fill.imageHash}`;
        }
        return undefined;
      })(),

      borderColor: (() => {
        if (isMixed(node.strokes)) return undefined;
        if (node.strokes.length === 0) return undefined;
        const stroke = node.strokes[0];
        if (stroke.type === "SOLID") {
          return `rgba(${stroke.color.r * 255},${stroke.color.g * 255},${
            stroke.color.b * 255
          },${stroke.opacity})`;
        }
        return undefined;
      })(),
      borderWidth: (() => {
        if (isMixed(node.strokes)) return undefined;
        if (node.strokes.length === 0) return undefined;
        if (isMixed(node.strokeWeight)) return undefined;
        if (typeof node.strokeWeight === "number") return node.strokeWeight;
        return undefined;
      })(),
      borderStyle: (() => {
        if (isMixed(node.strokes)) return undefined;
        if (node.strokes.length === 0) return undefined;
        if (isMixed(node.strokeWeight)) return undefined;
        if (typeof node.strokeWeight === "number") return "solid";
        return undefined;
      })() as "solid" | "dashed" | "dotted" | undefined,
    };

    return {
      children: node.children?.map((child) =>
        figmaNode2WebNode(child as FrameNode | InstanceNode)
      ),
      props,
      type: "Frame",
    };
  }
}
