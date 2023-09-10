import { DomNode } from "./DomNode";
import { TextDomNode } from "./TextDomNode";
import { TextDecoder } from "./TextDecoder";
import { handleInstanceNode } from "./handleInstanceNode";
import { supportedNodes } from "./supportedNodes";
import { variantToProps } from "./variantToProps";
import { convertToClasses } from "./convertToClasses";
import { DomMeta } from "../DomMeta";
import { parseDomName } from "../parseDomName";
import { toCamelCase } from "js-convert-case";
var DomParser = require("dom-parser");
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
  storyLayout: "centered" | "fullscreen" | "padded";
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
  meta?: DomMeta;
};
export type Props = {
  [key: string]: {
    type: string | "INSTANCE" | string[];
    defaultValue?: string;
  };
};

export async function figmaNodeToDomNode(
  node: SceneNode,
  ctx: Context
): Promise<DomNode | null> {
  if (!ctx.depth) ctx.depth = 0;

  let attrs: Record<
    string,
    {
      type: "variable";
      value: string;
    }
  > = {};
  const classes = await convertToClasses(node, ctx);
  if (node.parent?.type === "COMPONENT_SET") {
    ctx.props = {
      ...variantToProps(node.parent),
    };
    if (classes.includes("w-full")) {
      // ctx.storyLayout = "fullscreen";
    }

    if (ctx.meta) {
      ctx.meta.attributes.forEach((attr) => {
        attrs[attr.key] = {
          type: "variable",
          value: `props.${convertToVariantAvairableName(attr.value)}`,
        };
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(attr.value)] = {
          type: `?JSX.IntrinsicElements["${ctx.meta!.tagName}"]["${attr.key}"]`,
          defaultValue: `${attr.key}`,
        };
      });
    }
  }

  const domName = parseDomName(node.name);
  if (domName.meta.attributes.length > 0) {
    domName.meta.attributes.forEach((attr) => {
      ctx.props = ctx.props ?? {};
      ctx.props[convertToVariantAvairableName(attr.value)] = {
        type:
          node.type === "INSTANCE"
            ? `React.ComponentProps<typeof ${domName.name}>["${attr.key}"]`
            : `?JSX.IntrinsicElements["${domName.meta.tagName}"]["${attr.key}"]`,
        defaultValue: `${attr.key}`,
      };
      attrs[attr.key] = {
        type: "variable",
        value: `props.${convertToVariantAvairableName(attr.value)}`,
      };
    });
  }

  if (!supportedNodes(node)) return null;
  if (!node.visible) {
    classes.push("hidden");
  }
  const ignoreInstance =
    node.type === "INSTANCE" && ctx.ignoreInstance === true;
  if (node.type === "VECTOR") {
    const res = await node.exportAsync({ format: "SVG" });
    const svg = new TextDecoder("utf-8").decode(res);
    const parser = new DomParser();
    const svgDom = parser.parseFromString(svg);

    const domToDomNode = (dom: any) => {
      if (!dom.childNodes) return null;
      const children = dom.childNodes
        .map((child: any) => domToDomNode(child))
        .filter((x: any) => x !== null);
      const attrs: any = {};
      dom.attributes?.forEach((attr: any) => {
        if (attr.name === "fill") {
          if (!isMixed(node.fills)) {
            attrs["fill"] = "currentColor";
            return;
          }
        }
        attrs[attr.name] = attr.value;
      });
      return {
        type: dom.nodeName,
        attrs,
        children,
      };
    };

    const svgNode = domToDomNode(svgDom.getElementsByTagName("svg")[0]);
    if (!svgNode) throw new Error("svgNode is null");
    svgNode.attrs.class = {
      type: "value",
      value: classes.join(" "),
    };
    return svgNode;
  }
  if (node.type === "FRAME" || node.type === "COMPONENT" || ignoreInstance) {
    ctx.depth++;
    const childrenPromises = node.children.map(
      async (child) => await figmaNodeToDomNode(child, ctx)
    );
    const children = (await Promise.all(childrenPromises)).filter(
      (x) => x !== null
    ) as DomNode[];
    ctx.depth--;
    const joinedClasses = classes.join(" ");
    let name = "div";
    if (node.parent?.type === "COMPONENT_SET") {
      name = ctx.meta?.tagName ?? "div";
    } else {
      name = parseDomName(node.name).meta.tagName ?? "div";
    }
    return {
      type: name,
      name: node.name,
      attrs: {
        class: {
          value: joinedClasses,
          type: "value",
        },
        ...attrs,
      },
      children: children,
    };
  }

  if (node.type === "INSTANCE") {
    ctx.depth++;
    const r = handleInstanceNode(node, ctx);
    ctx.depth--;
    if (r.type !== "text" && "attrs" in r) {
      return {
        ...r,
        attrs: {
          class: {
            value: classes.join(" "),
            type: "value",
          },
          ...r.attrs,
        },
      };
    }
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
              class: {
                value: classes.join(" "),
                type: "value",
              },
              ...attrs,
            },
            children: [
              {
                type: "text",
                value: `{props.${convertToVariantAvairableName(key)}}`,
                valueType: "variable",
              },
            ],
          };
        }
      }
    }
    return {
      type: "div",
      attrs: {
        class: {
          value: classes.join(" "),
          type: "value",
        },
      },
      children: [
        {
          type: "text",
          value: node.characters,
          valueType: "string",
        },
      ],
    };
  }
  return null;
}

export function convertToVariantAvairableName(name: string) {
  return toCamelCase(name.split("#")[0].replace(/[ #:]/g, ""));
}

export function isTextDomNode(node: DomNode): node is TextDomNode {
  return node.type === "text";
}
