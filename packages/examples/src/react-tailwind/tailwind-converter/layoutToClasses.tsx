import { Align, Layout, LayoutProps } from "../../../../core/src";

export function layoutToClasses(props: LayoutProps) {
  const classes: string[] = ["flex"];
  if (props.layout === Layout.Vertical) {
    classes.push("flex-col");
  } else if (props.layout === Layout.Horizontal) {
    classes.push("flex-row");
  } else if (props.layout === Layout.Wrap) {
    classes.push("flex-wrap");
  }

  if (props.gap !== undefined) {
    classes.push(`gap-[${props.gap}px]`);
  }

  if (props.align !== undefined) {
    if (props.align === Align.TopLeft) {
      classes.push("justify-start");
      classes.push("items-start");
    } else if (props.align === Align.TopCenter) {
      classes.push("justify-center");
      classes.push("items-start");
    } else if (props.align === Align.TopRight) {
      classes.push("justify-end");
      classes.push("items-start");
    } else if (props.align === Align.Left) {
      classes.push("justify-start");
      classes.push("items-center");
    } else if (props.align === Align.Center) {
      classes.push("justify-center");
      classes.push("items-center");
    } else if (props.align === Align.Right) {
      classes.push("justify-end");
      classes.push("items-center");
    } else if (props.align === Align.BottomLeft) {
      classes.push("justify-start");
      classes.push("items-end");
    } else if (props.align === Align.BottomCenter) {
      classes.push("justify-center");
      classes.push("items-end");
    } else if (props.align === Align.BottomRight) {
      classes.push("justify-end");
      classes.push("items-end");
    } else if (props.align === Align.LeftAuto) {
      classes.push("justify-start");
      classes.push("items-auto");
      classes.push("items-auto");
    } else if (props.align === Align.RightAuto) {
      classes.push("justify-end");
      classes.push("items-auto");
    } else if (props.align === Align.TopAuto) {
      classes.push("justify-auto");
      classes.push("items-start");
    } else if (props.align === Align.BottomAuto) {
      classes.push("justify-auto");
      classes.push("items-end");
    } else if (props.align === Align.CenterAuto) {
      classes.push("justify-auto");
      classes.push("items-center");
    } else if (props.align === Align.TopBetween) {
      classes.push("justify-between");
      classes.push("items-start");
    } else if (props.align === Align.BottomBetween) {
      classes.push("justify-between");
      classes.push("items-end");
    } else if (props.align === Align.LeftBetween) {
      classes.push("justify-between");
      classes.push("items-start");
    } else if (props.align === Align.RightBetween) {
      classes.push("justify-between");
      classes.push("items-end");
    } else if (props.align === Align.CenterBetween) {
      classes.push("justify-between");
      classes.push("items-center");
    }

    if (
      props.layout == Layout.Vertical &&
      props.align !== Align.CenterBetween &&
      props.align !== Align.LeftBetween &&
      props.align !== Align.RightBetween &&
      props.align !== Align.TopBetween
    ) {
      const jc = classes[classes.length - 2];
      const ai = classes[classes.length - 1];
      classes[classes.length - 2] = ai.replace("items", "justify");
      classes[classes.length - 1] = jc.replace("justify", "items");
    }
  }

  if (props.paddingBottom !== undefined) {
    classes.push(`pb-[${props.paddingBottom}px]`);
  }
  if (props.paddingTop !== undefined) {
    classes.push(`pt-[${props.paddingTop}px]`);
  }
  if (props.paddingLeft !== undefined) {
    classes.push(`pl-[${props.paddingLeft}px]`);
  }
  if (props.paddingRight !== undefined) {
    classes.push(`pr-[${props.paddingRight}px]`);
  }

  return classes;
}
