import React from "react";
import { DimensionPorps, Size } from "../types";

export function dimensionToCss(props: DimensionPorps) {
  const css: React.CSSProperties = {};
  if (props.width === Size.Fill) {
    css.width = "100%";
  } else if (props.width === Size.Hug) {
    css.width = "fit-content";
  } else {
    css.width = props.width;
  }

  if (props.height === Size.Fill) {
    css.height = "100%";
  } else if (props.height === Size.Hug) {
    css.height = "fit-content";
  } else {
    css.height = props.height;
  }

  if (props.maxWidth) {
    css.maxWidth = props.maxWidth;
  }
  if (props.minWidth) {
    css.minWidth = props.minWidth;
  }
  if (props.maxHeight) {
    css.maxHeight = props.maxHeight;
  }
  if (props.minHeight) {
    css.minHeight = props.minHeight;
  }
  if (
    props.top !== undefined ||
    props.bottom !== undefined ||
    props.left !== undefined ||
    props.right !== undefined
  ) {
    css.position = "absolute";
  } else {
    css.position = "relative";
  }
  if (props.top !== undefined) {
    css.top = props.top;
  }
  if (props.bottom !== undefined) {
    css.bottom = props.bottom;
  }
  if (props.left !== undefined) {
    css.left = props.left;
  }
  if (props.right !== undefined) {
    css.right = props.right;
  }

  if (props.borderRadius !== undefined) {
    css.borderRadius = props.borderRadius;
  }
  if (props.overflow !== undefined) {
    css.overflow = props.overflow;
  }

  return css;
}
