import { EffectProps } from "./../../core/src/types/EffectProps";
import { toCamelCase } from "js-convert-case";
export function varIdToVariableName(id: string) {
  let name = id.split("#")[0];
  name = name.replace(/ /g, "");
  name = toCamelCase(name);
  if (name.match(/^[0-9]/)) name = "_" + name;
  return name;
}
import {
  DimensionPorps,
  FillProps,
  LayoutProps,
  StrokeProps,
} from "../../core/src";

export type WebNode =
  | {
      children?: WebNode[];
      props:
        | (FillProps & LayoutProps & DimensionPorps & StrokeProps & EffectProps)
        | TextPropsBridge;
      type: "Frame" | "Text";
    }
  | InstanceWebNode
  | SlotInstanceWebNode
  | SVGWebNode;

type InstanceWebNode = {
  type: "Instance";
  props: any;
};
type SlotInstanceWebNode = {
  type: "SlotInstance";
  props: any;
};
type SVGWebNode = {
  type: "SVG";
  props: {
    svg: string;
  };
};

export type TextPropsBridge = {
  text?: string | (() => string);
  fontSize?: number;
  lineHeight?: number;
  fontStyle?: "normal" | "italic" | "oblique" | "bold";
  fontWeight?: number | string;
} & DimensionPorps &
  FillProps;

export * from "./figmaNode2WebNode";

export type Context = {
  colors: ColorVariable[];
};

type ColorVariable = {
  name: string;
  paint: {
    opacity: number;
    color: {
      r: number;
      g: number;
      b: number;
    };
    visible: boolean;
  };
};
