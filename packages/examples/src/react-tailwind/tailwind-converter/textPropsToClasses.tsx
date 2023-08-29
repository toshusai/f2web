import { TextProps } from "../../../../core/src/types/TextProps";

export function textPropsToClasses(props: TextProps) {
  const classes: string[] = [];
  if (props.fontSize !== undefined) {
    classes.push(`text-[${props.fontSize}px]`);
  }
  if (props.lineHeight !== undefined) {
    classes.push(`leading-[${Math.round(props.lineHeight)}px]`);
  }
  if (props.fontStyle !== undefined) {
    classes.push(`${props.fontStyle}`);
  }
  if (props.fontWeight !== undefined) {
    classes.push(`font-[${props.fontWeight}]`);
  }
  return classes;
}
