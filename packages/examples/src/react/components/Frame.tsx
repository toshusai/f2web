import React, { CSSProperties } from "react";
import { DimensionPorps } from "../../../../core/src";
import { LayoutProps } from "../../../../core/src";
import { FillProps } from "../../../../core/src";
import { StrokeProps } from "../../../../core/src/types";
import {
  dimensionToCss,
  fillToCss,
  layoutToCss,
  strokeToCss,
} from "../converter";

export { Text } from "./Text";

export type FrameProps = DimensionPorps &
  LayoutProps &
  FillProps &
  StrokeProps & {
    children?: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
  } & React.HTMLAttributes<HTMLElement>;

export function Frame(props: FrameProps) {
  const css: CSSProperties = {
    ...dimensionToCss(props),
    ...layoutToCss(props),
    ...fillToCss(props),
    ...strokeToCss(props),
    boxSizing: "border-box",
  };
  const As = props.as || "div";
  return (
    <As style={css} src={props.src}>
      {props.children}
    </As>
  );
}
