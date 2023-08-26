import { CSSProperties } from "react";
import { DimensionPorps } from "../../../../core/src/types/DimensionPorps";
import { FillProps } from "../../../../core/src/types/FillProps";
import { dimensionToCss } from "../converter";
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
