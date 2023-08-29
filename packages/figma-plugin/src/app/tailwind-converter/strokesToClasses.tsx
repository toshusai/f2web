import { StrokeProps } from "../../../../core/src";
import { rgbaToHex } from "./utils/rgbaToHex";

export function strokesToClasses(props: StrokeProps) {
  const classes: string[] = [];
  if (
    props.borderWidth !== undefined ||
    props.borderBottom !== undefined ||
    props.borderTop !== undefined ||
    props.borderLeft !== undefined ||
    props.borderRight !== undefined
  ) {
    classes.push(`before:border-[${props.borderWidth}px]`);
    classes.push(`before:absolute`);
    classes.push(`before:w-full`);
    classes.push(`before:h-full`);
  }
  if (props.borderColor !== undefined) {
    const cssKey = `${rgbaToHex(props.borderColor)}`;
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            [cssKey]: props.borderColor,
            ...tailwind.config.theme?.extend?.colors,
          },
        },
      },
    };
    classes.push(`before:border-${cssKey}`);
  }
  if (props.borderTop !== undefined) {
    classes.push(`before:border-t-[${props.borderTop}px]`);
  }
  if (props.borderBottom !== undefined) {
    classes.push(`before:border-b-[${props.borderBottom}px]`);
  }
  if (props.borderLeft !== undefined) {
    classes.push(`before:border-l-[${props.borderLeft}px]`);
  }
  if (props.borderRight !== undefined) {
    classes.push(`before:border-r-[${props.borderRight}px]`);
  }

  return classes;
}
