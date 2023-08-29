import { WebNode } from "../../../../web/src";
import { FillProps } from "../../../../core/src";
import { rgbaToHex } from "./utils/rgbaToHex";

export function fillToClasses(props: FillProps, type: WebNode["type"]) {
  const classes: string[] = [];
  if (props.fillColor) {
    const cssKey = `${rgbaToHex(props.fillColor)}`;
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            [cssKey]: props.fillColor,
            ...tailwind.config.theme?.extend?.colors,
          },
        },
      },
    };
    if (type === "Frame") {
      classes.push(`bg-${cssKey}`);
    } else {
      classes.push(`text-${cssKey}`);
    }
  }
  return classes;
}
