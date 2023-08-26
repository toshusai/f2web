import React from "react";
import { StrokeProps } from "../../../../core/src/types";

export function strokeToCss(props: StrokeProps) {
  const css: React.CSSProperties = {};
  if (props.borderColor) {
    css.borderColor = props.borderColor;
  }
  if (props.borderWidth) {
    css.borderWidth = props.borderWidth;
  }
  if (props.borderStyle) {
    css.borderStyle = props.borderStyle;
  }
  return css;
}
