import { WebNode } from "../../../../web/src";
import { FillProps } from "../../../../core/src";
import { convertToCssAvairableName } from "../../code-writer/convertToCssAvairableName";

declare const tailwind: any;

export function fillToClasses(props: FillProps, type: WebNode["type"]) {
  const classes: string[] = [];
  if (props.fillColor) {
    if (type === "Frame") {
      classes.push(`bg-${convertToCssAvairableName(props.fillColor)}`);
    } else {
      classes.push(`text-${convertToCssAvairableName(props.fillColor)}`);
    }
  }
  return classes;
}
