import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { WebNode } from "../../../web/src";
import {
  Align,
  DimensionPorps,
  FillProps,
  Layout,
  LayoutProps,
  Size,
  StrokeProps,
} from "../../../core/src";
import { toCamelCase } from "js-convert-case";

declare const tailwind: any;

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("react-page");
  if (!container) return console.error("No container found");
  const root = createRoot(container);
  root.render(<App />);
});

function typeToType(type: ComponentPropertyType, variantOptions?: string[]) {
  if (type === "TEXT") return "string";
  if (type === "BOOLEAN") return "boolean";
  if (type === "INSTANCE_SWAP") return "Component";
  if (type === "VARIANT")
    return variantOptions?.map((v) => `"${v}"`).join(" | ");
  throw new Error(`Unknown type ${type}`);
}

export function varIdToVariableName(id: string) {
  let name = id.split("#")[0];
  name = name.replace(/ /g, "");
  name = toCamelCase(name);
  if (name.match(/^[0-9]/)) name = "_" + name;
  return name;
}

export function changeToProps(componentSet: ComponentSetNode) {
  const obj = {};
  for (const key in componentSet.componentPropertyDefinitions) {
    const prop = componentSet.componentPropertyDefinitions[key];
    obj[varIdToVariableName(key)] = typeToType(prop.type, prop.variantOptions);
  }
  return obj;
}

export function toTailwindHtml(webNode: WebNode) {
  const props = webNode.props;
  const children = "children" in webNode ? webNode.children : undefined;
  const classes = [
    ...layoutToClasses(props as LayoutProps),
    ...fillToCss(props as FillProps, webNode.type),
    ...dimensionToClasses(props as DimensionPorps),
    ...textPropsToClasses(props as TextProps),
    ...effectToClasses(props),
    ...strokesToClasses(props as StrokeProps),
  ];
  const isImage = webNode.props.src !== undefined;

  let tag = "div";
  if (isImage) {
    tag = "img";
  }
  if (webNode.type === "SlotInstance") {
    return `\${props.${webNode.props.name}}`;
  }

  if (webNode.type === "SVG") {
    return webNode.props.svg;
  }
  if (webNode.type === "Instance") {
    return `<${webNode.props.name} />`;
  }
  const attrs: { [key: string]: string } = {};
  if (isImage) {
    attrs.src = `https://picsum.photos/seed/${props.src}/600/400`;
  }

  const child = children
    ? children.map((child) => toTailwindHtml(child)).join("")
    : "text" in props && typeof props.text === "string"
    ? props.text
    : "text" in props && typeof props.text === "function"
    ? props.text()
    : "";
  const html = `<${tag} class="${classes.join(" ")}" ${Object.entries(
    attrs
  ).map(([key, value]) => `${key}="${value}"`)}>${child}</${tag}>`;
  return html;
}

type TextProps = {
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  fontStyle?: "normal" | "italic" | "oblique";
  fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number;
};

function strokesToClasses(props: StrokeProps) {
  const classes: string[] = [];
  if (
    props.borderWidth !== undefined ||
    props.borderBottom !== undefined ||
    props.borderTop !== undefined ||
    props.borderLeft !== undefined ||
    props.borderRight !== undefined
  ) {
    classes.push(`before:border-[${props.borderWidth}px]`);
    classes.push(`before:absolute`);
    classes.push(`before:w-full`);
    classes.push(`before:h-full`);
  }
  if (props.borderColor !== undefined) {
    const cssKey = `${rgbaToHex(props.borderColor)}`;
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            [cssKey]: props.borderColor,
            ...tailwind.config.theme?.extend?.colors,
          },
        },
      },
    };
    classes.push(`before:border-${cssKey}`);
  }
  if (props.borderTop !== undefined) {
    classes.push(`before:border-t-[${props.borderTop}px]`);
  }
  if (props.borderBottom !== undefined) {
    classes.push(`before:border-b-[${props.borderBottom}px]`);
  }
  if (props.borderLeft !== undefined) {
    classes.push(`before:border-l-[${props.borderLeft}px]`);
  }
  if (props.borderRight !== undefined) {
    classes.push(`before:border-r-[${props.borderRight}px]`);
  }

  return classes;
}

function textPropsToClasses(props: TextProps) {
  const classes: string[] = [];
  if (props.fontSize !== undefined) {
    classes.push(`text-[${props.fontSize}px]`);
  }
  if (props.lineHeight !== undefined) {
    classes.push(`leading-[${Math.round(props.lineHeight)}px]`);
  }
  if (props.fontStyle !== undefined) {
    classes.push(`${props.fontStyle}`);
  }
  if (props.fontWeight !== undefined) {
    classes.push(`font-[${props.fontWeight}]`);
  }
  return classes;
}

function effectToClasses(props: any) {
  const classes: string[] = [];
  if (props.boxShadow !== undefined) {
    const value = props.boxShadow.replace(/ /g, "_");
    classes.push(`shadow-[${value}]`);
  }
  return classes;
}

function parseRgba(rgba: string) {
  const [r, g, b, a] = rgba
    .replace("rgba(", "")
    .replace(")", "")
    .replace(/ /g, "")
    .split(",")
    .map((v) => parseFloat(v));
  return { r, g, b, a };
}

function rgbaToHex(rgba: string) {
  const { r, g, b, a } = parseRgba(rgba);
  return `#${Math.round(r).toString(16)}${Math.round(g).toString(
    16
  )}${Math.round(b).toString(16)}${Math.round(a * 255).toString(16)}`;
}

export function fillToCss(props: FillProps, type: WebNode["type"]) {
  const classes: string[] = [];
  if (props.fillColor) {
    const cssKey = `${rgbaToHex(props.fillColor)}`;
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            [cssKey]: props.fillColor,
            ...tailwind.config.theme?.extend?.colors,
          },
        },
      },
    };
    if (type === "Frame") {
      classes.push(`bg-${cssKey}`);
    } else {
      classes.push(`text-${cssKey}`);
    }
  }
  return classes;
}

export function dimensionToClasses(props: DimensionPorps) {
  const classes: string[] = [];
  if (props.width !== undefined) {
    if (props.width === Size.Fill) {
      classes.push(`w-full`);
    } else if (props.width === Size.Hug) {
      classes.push(`w-auto`);
    } else {
      classes.push(`w-[${props.width}px]`);
    }
  }
  if (props.height !== undefined) {
    if (props.height === Size.Fill) {
      classes.push(`h-full`);
    } else if (props.height === Size.Hug) {
      classes.push(`h-fit`);
    } else {
      classes.push(`h-[${props.height}px]`);
    }
  }
  if (props.minWidth !== undefined) {
    classes.push(`min-w-[${props.minWidth}px]`);
  }
  if (props.minHeight !== undefined) {
    classes.push(`min-h-[${props.minHeight}px]`);
  }
  if (props.maxWidth !== undefined) {
    classes.push(`max-w-[${props.maxWidth}px]`);
  }
  if (props.maxHeight !== undefined) {
    classes.push(`max-h-[${props.maxHeight}px]`);
  }

  if (
    props.top !== undefined ||
    props.bottom !== undefined ||
    props.left !== undefined ||
    props.right !== undefined
  ) {
    classes.push(`absolute`);
  } else {
    classes.push(`relative`);
  }

  if (props.bottom !== undefined) {
    classes.push(`bottom-[${props.bottom}px]`);
  }
  if (props.left !== undefined) {
    classes.push(`left-[${props.left}px]`);
  }
  if (props.right !== undefined) {
    classes.push(`right-[${props.right}px]`);
  }
  if (props.top !== undefined) {
    classes.push(`top-[${props.top}px]`);
  }

  if (props.borderRadius !== undefined) {
    classes.push(`rounded-[${props.borderRadius}px]`);
  }

  if (props.borderBottomLeftRadius !== undefined) {
    classes.push(`rounded-bl-[${props.borderBottomLeftRadius}px]`);
  }
  if (props.borderBottomRightRadius !== undefined) {
    classes.push(`rounded-br-[${props.borderBottomRightRadius}px]`);
  }
  if (props.borderTopLeftRadius !== undefined) {
    classes.push(`rounded-tl-[${props.borderTopLeftRadius}px]`);
  }
  if (props.borderTopRightRadius !== undefined) {
    classes.push(`rounded-tr-[${props.borderTopRightRadius}px]`);
  }

  if (props.overflow !== undefined) {
    classes.push(`overflow-${props.overflow}`);
  }

  return classes;
}

export function layoutToClasses(props: LayoutProps) {
  const classes: string[] = ["flex"];
  if (props.layout === Layout.Vertical) {
    classes.push("flex-col");
  } else if (props.layout === Layout.Horizontal) {
    classes.push("flex-row");
  } else if (props.layout === Layout.Wrap) {
    classes.push("flex-wrap");
  }

  if (props.gap !== undefined) {
    classes.push(`gap-[${props.gap}px]`);
  }

  if (props.align !== undefined) {
    if (props.align === Align.TopLeft) {
      classes.push("justify-start");
      classes.push("items-start");
    } else if (props.align === Align.TopCenter) {
      classes.push("justify-center");
      classes.push("items-start");
    } else if (props.align === Align.TopRight) {
      classes.push("justify-end");
      classes.push("items-start");
    } else if (props.align === Align.Left) {
      classes.push("justify-start");
      classes.push("items-center");
    } else if (props.align === Align.Center) {
      classes.push("justify-center");
      classes.push("items-center");
    } else if (props.align === Align.Right) {
      classes.push("justify-end");
      classes.push("items-center");
    } else if (props.align === Align.BottomLeft) {
      classes.push("justify-start");
      classes.push("items-end");
    } else if (props.align === Align.BottomCenter) {
      classes.push("justify-center");
      classes.push("items-end");
    } else if (props.align === Align.BottomRight) {
      classes.push("justify-end");
      classes.push("items-end");
    } else if (props.align === Align.LeftAuto) {
      classes.push("justify-start");
      classes.push("items-auto");
      classes.push("items-auto");
    } else if (props.align === Align.RightAuto) {
      classes.push("justify-end");
      classes.push("items-auto");
    } else if (props.align === Align.TopAuto) {
      classes.push("justify-auto");
      classes.push("items-start");
    } else if (props.align === Align.BottomAuto) {
      classes.push("justify-auto");
      classes.push("items-end");
    } else if (props.align === Align.CenterAuto) {
      classes.push("justify-auto");
      classes.push("items-center");
    } else if (props.align === Align.TopBetween) {
      classes.push("justify-between");
      classes.push("items-start");
    } else if (props.align === Align.BottomBetween) {
      classes.push("justify-between");
      classes.push("items-end");
    } else if (props.align === Align.LeftBetween) {
      classes.push("justify-between");
      classes.push("items-start");
    } else if (props.align === Align.RightBetween) {
      classes.push("justify-between");
      classes.push("items-end");
    } else if (props.align === Align.CenterBetween) {
      classes.push("justify-between");
      classes.push("items-center");
    }

    if (
      props.layout == Layout.Vertical &&
      props.align !== Align.CenterBetween &&
      props.align !== Align.LeftBetween &&
      props.align !== Align.RightBetween &&
      props.align !== Align.TopBetween
    ) {
      const jc = classes[classes.length - 2];
      const ai = classes[classes.length - 1];
      classes[classes.length - 2] = ai.replace("items", "justify");
      classes[classes.length - 1] = jc.replace("justify", "items");
    }
  }

  if (props.paddingBottom !== undefined) {
    classes.push(`pb-[${props.paddingBottom}px]`);
  }
  if (props.paddingTop !== undefined) {
    classes.push(`pt-[${props.paddingTop}px]`);
  }
  if (props.paddingLeft !== undefined) {
    classes.push(`pl-[${props.paddingLeft}px]`);
  }
  if (props.paddingRight !== undefined) {
    classes.push(`pr-[${props.paddingRight}px]`);
  }

  return classes;
}
