import { DomNode } from "../types/DomNode";
import { TextDomNode } from "../types/TextDomNode";
import { TextDecoder } from "../utils/TextDecoder";
import { handleInstanceNode } from "./handleInstanceNode";
import { supportedNodes } from "./supportedNodes";
import { variantToProps } from "./variantToProps";
import { parseDomName } from "./parseDomName";
import { toCamelCase } from "js-convert-case";
import { FigmaClient, convertToCssProperties } from "./convertToCssProperties";
import { AttrType, AttrValue } from "../types/AttrValue";
import { domToDomNode } from "./domToDomNode";
import { Context } from "../types/Context";

var DomParser = require("dom-parser");

export async function figmaNodeToDomNode(
  node: SceneNode,
  ctx: Context,
  client: FigmaClient = {
    getVariableById: figma.variables.getVariableById,
    getStyleById: figma.getStyleById,
  }
): Promise<DomNode | null> {
  if (!ctx.depth) ctx.depth = 0;

  let attrs: Record<string, AttrValue> = {};
  let variants: Record<string, DomNode> | undefined = undefined;
  const styles = await convertToCssProperties(node, ctx, client);
  if (!styles) return null;
  if (node.parent?.type === "COMPONENT_SET") {
    ctx.props = {
      ...variantToProps(node.parent),
    };

    if (ctx.meta) {
      ctx.meta.attributes.forEach((attr) => {
        attrs[attr.key] = {
          type: AttrType.VARIABLE,
          value: convertToVariantAvairableName(attr.value),
        };
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(attr.value)] = {
          // type: `?JSX.IntrinsicElements["${ctx.meta!.tagName}"]["${attr.key}"]`,
          type: {
            type: "typeof",
            typeName: ctx.meta!.tagName,
            propName: attr.key,
            optional: true,
          },
          defaultValue: `"${attr.key}"`,
        };
      });
    }
  }

  const domName = parseDomName(node.name);
  if (domName.meta.attributes.length > 0) {
    let name = domName.name;
    if (node.type === "INSTANCE") {
      name =
        parseDomName(node.mainComponent?.parent?.name ?? "").name ??
        domName.name;
    }
    domName.meta.attributes.forEach((attr) => {
      ctx.props = ctx.props ?? {};
      ctx.props[convertToVariantAvairableName(attr.value)] = {
        // type:
        //   node.type === "INSTANCE"
        //     ? `React.ComponentProps<typeof ${domName.name}>["${attr.key}"]`
        //     : `?JSX.IntrinsicElements["${domName.meta.tagName}"]["${attr.key}"]`,
        type: {
          type: "typeof",
          typeName: node.type === "INSTANCE" ? name : domName.meta.tagName,
          propName: attr.key,
          optional: node.type !== "INSTANCE",
        },
        defaultValue: `"${attr.key}"`,
      };
      attrs[attr.key] = {
        type: AttrType.VARIABLE,
        value: convertToVariantAvairableName(attr.value),
      };
    });
  }

  if (!supportedNodes(node)) return null;
  if (node.componentPropertyReferences?.visible) {
    ctx.props = ctx.props ?? {};
    ctx.props[convertToVariantAvairableName("visible")] = {
      type: {
        type: "native",
        value: "boolean",
      },
      defaultValue: "true",
    };

    variants ??= {};
    variants[`${convertToVariantAvairableName("visible")}=false`] = {
      type: "NULL",
      attrs: {},
      children: [],
    };
  }
  if (!node.visible) {
    styles.display = "hidden";
  }
  const ignoreInstance =
    node.type === "INSTANCE" && ctx.ignoreInstance === true;
  if (node.type === "VECTOR") {
    let svg = "";
    if (!ctx.svgCache) ctx.svgCache = {};
    if (ctx.svgCache[node.name]) {
      svg = ctx.svgCache[node.name];
    } else {
      const res = await node.exportAsync({ format: "SVG" });
      svg = new TextDecoder("utf-8").decode(res);
      ctx.svgCache[node.name] = svg;
    }
    const parser = new DomParser();
    const svgDom = parser.parseFromString(svg);

    const svgNode = domToDomNode(node, svgDom.getElementsByTagName("svg")[0]);
    if (!svgNode) throw new Error("svgNode is null");
    if (isTextDomNode(svgNode)) return null;
    svgNode.styles = styles;
    return svgNode;
  }
  if (node.type === "FRAME" || node.type === "COMPONENT" || ignoreInstance) {
    const childrenPromises = node.children.map(
      async (child) => await figmaNodeToDomNode(child, ctx, client)
    );
    const children = (await Promise.all(childrenPromises)).filter(
      (x) => x !== null
    ) as DomNode[];
    let name = "div";
    if (node.parent?.type === "COMPONENT_SET") {
      name = ctx.meta?.tagName ?? "div";
    } else {
      name = parseDomName(node.name).meta.tagName ?? "div";
    }
    return {
      type: name,
      name: node.name,
      variants,
      attrs,
      styles: styles,
      children: children,
    };
  }

  if (node.type === "INSTANCE") {
    const r = handleInstanceNode(node, ctx);
    if (r.type !== "text" && "attrs" in r) {
      return {
        ...r,
        variants,
        styles,
      };
    }
    return r;
  }

  if (node.type === "TEXT") {
    const textNode = handleTextNode(node, ctx);
    if (isTextDomNode(textNode)) return null;
    textNode.styles = styles;
    textNode.variants = variants;
    return textNode;
  }
  return null;
}

export function handleTextNode(node: TextNode, ctx: Context): DomNode {
  if (node.componentPropertyReferences?.characters) {
    for (const key in ctx.root.componentPropertyDefinitions) {
      if (node.componentPropertyReferences.characters === key) {
        ctx.props = ctx.props ?? {};
        ctx.props[convertToVariantAvairableName(key)] = {
          type: {
            type: "native",
            value: "string",
          },
          defaultValue: node.characters,
        };
        return {
          type: "div",
          attrs: {},
          children: [
            {
              type: "text",
              value: convertToVariantAvairableName(key),
              valueType: "variable",
            },
          ],
        };
      }
    }
  }
  return {
    type: "div",
    attrs: {},
    children: [
      {
        type: "text",
        value: node.characters,
        valueType: "string",
      },
    ],
  };
}

export function convertToVariantAvairableName(name: string) {
  return toCamelCase(name.split("#")[0].replace(/[ #:]/g, ""));
}

export function isTextDomNode(node: DomNode): node is TextDomNode {
  return node.type === "text";
}
