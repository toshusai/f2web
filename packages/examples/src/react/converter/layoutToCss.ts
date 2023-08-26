import React from "react";
import { Layout } from "../../../../core/src/types";
import { Align } from "../../../../core/src/types";
import { LayoutProps } from "../../../../core/src/types";

export function layoutToCss(props: LayoutProps) {
  const css: React.CSSProperties = {
    display: "flex",
  };
  if (props.layout === Layout.Vertical) {
    css.flexDirection = "column";
  } else if (props.layout === Layout.Horizontal) {
    css.flexDirection = "row";
  } else if (props.layout === Layout.Wrap) {
    css.flexWrap = "wrap";
  }

  if (props.gap !== undefined) {
    css.gap = props.gap;
  }

  if (props.align !== undefined) {
    if (props.align === Align.TopLeft) {
      css.justifyContent = "flex-start";
      css.alignItems = "flex-start";
    } else if (props.align === Align.TopCenter) {
      css.justifyContent = "center";
      css.alignItems = "flex-start";
    } else if (props.align === Align.TopRight) {
      css.justifyContent = "flex-end";
      css.alignItems = "flex-start";
    } else if (props.align === Align.Left) {
      css.justifyContent = "flex-start";
      css.alignItems = "center";
    } else if (props.align === Align.Center) {
      css.justifyContent = "center";
      css.alignItems = "center";
    } else if (props.align === Align.Right) {
      css.justifyContent = "flex-end";
      css.alignItems = "center";
    } else if (props.align === Align.BottomLeft) {
      css.justifyContent = "flex-start";
      css.alignItems = "flex-end";
    } else if (props.align === Align.BottomCenter) {
      css.justifyContent = "center";
      css.alignItems = "flex-end";
    } else if (props.align === Align.BottomRight) {
      css.justifyContent = "flex-end";
      css.alignItems = "flex-end";
    } else if (props.align === Align.LeftAuto) {
      css.justifyContent = "flex-start";
      css.alignItems = "auto";
    } else if (props.align === Align.RightAuto) {
      css.justifyContent = "flex-end";
      css.alignItems = "auto";
    } else if (props.align === Align.TopAuto) {
      css.justifyContent = "auto";
      css.alignItems = "flex-start";
    } else if (props.align === Align.BottomAuto) {
      css.justifyContent = "auto";
      css.alignItems = "flex-end";
    } else if (props.align === Align.CenterAuto) {
      css.justifyContent = "auto";
      css.alignItems = "center";
    } else if (props.align === Align.TopBetween) {
      css.justifyContent = "space-between";
      css.alignItems = "flex-start";
    } else if (props.align === Align.BottomBetween) {
      css.justifyContent = "space-between";
      css.alignItems = "flex-end";
    } else if (props.align === Align.LeftBetween) {
      css.justifyContent = "space-between";
      css.alignItems = "flex-start";
    } else if (props.align === Align.RightBetween) {
      css.justifyContent = "space-between";
      css.alignItems = "flex-end";
    } else if (props.align === Align.CenterBetween) {
      css.justifyContent = "space-between";
      css.alignItems = "center";
    }
    if (
      props.layout == Layout.Vertical &&
      props.align !== Align.CenterBetween &&
      props.align !== Align.LeftBetween &&
      props.align !== Align.RightBetween &&
      props.align !== Align.TopBetween
    ) {
      const jc = css.justifyContent;
      css.justifyContent = css.alignItems;
      css.alignItems = jc;
    }
  }

  if (props.paddingHorizon) {
    css.paddingLeft = props.paddingHorizon;
    css.paddingRight = props.paddingHorizon;
  }
  if (props.paddingVertical) {
    css.paddingTop = props.paddingVertical;
    css.paddingBottom = props.paddingVertical;
  }
  if (props.paddingTop) {
    css.paddingTop = props.paddingTop;
  }
  if (props.paddingBottom) {
    css.paddingBottom = props.paddingBottom;
  }
  if (props.paddingLeft) {
    css.paddingLeft = props.paddingLeft;
  }
  if (props.paddingRight) {
    css.paddingRight = props.paddingRight;
  }
  return css;
}
