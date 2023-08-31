import { DomNode } from "./DomNode";
import { TextDomNode } from "./TextDomNode";
import { TextDecoder } from "./TextDecoder";
import { handleInstanceNode } from "./handleInstanceNode";
import { supportedNodes } from "./supportedNodes";
import { variantToProps } from "./variantToProps";
import { convertToClasses } from "./convertToClasses";
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

export type Context = {
  root: ComponentSetNode;
  ignoreInstance: boolean;
  name: string;
  props?: Props;
  colors?: {
    [key: string]: string;
  };
  images?: {
    [key: string]: Uint8Array;
  };
  dependencies?: {
    [key: string]: string;
  };
  depth?: number;
};
export type Props = {
  [key: string]: {
    type: "string" | "INSTANCE" | string[];
    defaultValue?: string;
  };
};

export async function figmaNodeToDomNode(
  node: SceneNode,
  ctx: Context
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
          src: {
            type: "variable",
            value: `props.${img.replace("img=", "")}`,
          },
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
          ctx.props[convertToVariantAvairableName(key)] = {
            type: "string",
            defaultValue: node.characters,
          };
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
