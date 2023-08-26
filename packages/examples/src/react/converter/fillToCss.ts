import React from "react";
import { FillProps } from "../../../../core/src/types/FillProps";

export function fillToCss(props: FillProps) {
  const css: React.CSSProperties = {};
  if (props.fillColor) {
    css.backgroundColor = props.fillColor;
  }
  if (props.opacity) {
    css.opacity = props.opacity;
  }
  return css;
}
