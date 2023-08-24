import React, { CSSProperties } from "react";
import { StrokeProps } from "./types/StrokeProps";
import { DimensionPorps } from "./types/DimensionPorps";
import { LayoutProps } from "./types/LayoutProps";
import { FillProps } from "./types/FillProps";
import { fillToCss } from "./converter/fillToCss";
import { dimensionToCss } from "./converter/dimensionToCss";
import { layoutToCss } from "./converter/layoutToCss";
import { strokeToCss } from "./converter/strokeToCss";
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
