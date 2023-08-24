import { CSSProperties } from "react";
import { DimensionPorps } from "./types/DimensionPorps";
import { FillProps } from "./types/FillProps";
import { dimensionToCss } from "./converter/dimensionToCss";
export type TextProps = DimensionPorps &
  FillProps & {
    text?: string;
    fontSize?: number;
    lineHeight?: number;
    fontStyle?: "normal" | "italic" | "oblique";
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number;
  };

export function Text(props: TextProps) {
  const css: CSSProperties = {
    ...dimensionToCss(props),
    fontSize: props.fontSize,
    lineHeight: props.lineHeight + "px",
    fontStyle: props.fontStyle,
    fontWeight: props.fontWeight,
    color: props.fillColor,
  };
  return <div style={css}>{props.text}</div>;
}
