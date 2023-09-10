import { Properties } from "../../types/Properties";
import { optimizeClasses } from "./optimizeClasses";

export function cssPropsToClasses(props: Partial<Properties>) {
  const classes: string[] = [];
  if (props.color) {
    if (props.color.startsWith("#")) {
      classes.push(`text-[${props.color}]`);
    } else {
      classes.push(`text-${props.color}`);
    }
  }
  if (props.backgroundColor) {
    if (props.backgroundColor.startsWith("linear-gradient")) {
      classes.push(`bg-gradient-to-br`);
      classes.push(`from-red-500`);
      classes.push(`to-blue-500`);
    } else {
      if (props.backgroundColor.startsWith("#")) {
        classes.push(`bg-[${props.backgroundColor}]`);
      } else {
        classes.push(`bg-${props.backgroundColor}`);
      }
    }
  }
  if (props.paddingBottom) {
    classes.push(`pb-[${props.paddingBottom}px]`);
  }
  if (props.paddingTop) {
    classes.push(`pt-[${props.paddingTop}px]`);
  }
  if (props.paddingLeft) {
    classes.push(`pl-[${props.paddingLeft}px]`);
  }
  if (props.paddingRight) {
    classes.push(`pr-[${props.paddingRight}px]`);
  }
  if (props.alignItems) {
    classes.push(`items-${props.alignItems}`);
  }
  if (props.justifyContent) {
    classes.push(`justify-${props.justifyContent}`);
  }
  if (props.flexDirection) {
    if (props.flexDirection === "column") {
      classes.push(`flex-col`);
    }
  }
  if (props.borderBottomLeftRadius) {
    classes.push(`rounded-bl-[${props.borderBottomLeftRadius}px]`);
  }
  if (props.borderBottomRightRadius) {
    classes.push(`rounded-br-[${props.borderBottomRightRadius}px]`);
  }
  if (props.borderTopLeftRadius) {
    classes.push(`rounded-tl-[${props.borderTopLeftRadius}px]`);
  }
  if (props.borderTopRightRadius) {
    classes.push(`rounded-tr-[${props.borderTopRightRadius}px]`);
  }
  if (props.borderBottomWidth) {
    classes.push(`border-b-[${props.borderBottomWidth}px]`);
  }
  if (props.borderTopWidth) {
    classes.push(`border-t-[${props.borderTopWidth}px]`);
  }
  if (props.borderLeftWidth) {
    classes.push(`border-l-[${props.borderLeftWidth}px]`);
  }
  if (props.borderRightWidth) {
    classes.push(`border-r-[${props.borderRightWidth}px]`);
  }
  if (props.borderColor) {
    classes.push(`border-${props.borderColor}`);
  }
  if (props.top) {
    classes.push(`top-[${props.top}px]`);
  }
  if (props.left) {
    classes.push(`left-[${props.left}px]`);
  }
  if (props.right) {
    classes.push(`right-[${props.right}px]`);
  }
  if (props.bottom) {
    classes.push(`bottom-[${props.bottom}px]`);
  }
  if (props.position) {
    classes.push(`${props.position}`);
  }
  if (props.width) {
    if (typeof props.width === "number") {
      classes.push(`w-[${props.width}px]`);
    } else {
      classes.push(`w-${props.width}`);
    }
  }
  if (props.height) {
    if (typeof props.height === "number") {
      classes.push(`h-[${props.height}px]`);
    } else {
      classes.push(`h-${props.height}`);
    }
  }
  if (props.minWidth) {
    classes.push(`min-w-[${props.minWidth}px]`);
  }
  if (props.minHeight) {
    classes.push(`min-h-[${props.minHeight}px]`);
  }
  if (props.maxWidth) {
    classes.push(`max-w-[${props.maxWidth}px]`);
  }
  if (props.maxHeight) {
    classes.push(`max-h-[${props.maxHeight}px]`);
  }
  if (props.display) {
    classes.push(`${props.display}`);
  }
  if (props.boxShadow) {
    const split = props.boxShadow.split(" ");
    if (split.length === 5) {
      const [x, y, blur, spread, color] = split;
      classes.push(`shadow-[${x}_${y}_${blur}_${spread}_${color}]`);
    }
  }
  if (props.fontSize) {
    classes.push(`text-[${props.fontSize}px]`);
  }
  if (props.fontWeight) {
    classes.push(`font-[${props.fontWeight}]`);
  }
  if (props.lineHeight) {
    classes.push(`leading-[${props.lineHeight}px]`);
  }
  if (props.textAlign) {
    classes.push(`text-${props.textAlign}`);
  }
  if (props.gap) {
    classes.push(`gap-[${props.gap}px]`);
  }
  if (props.lineHeight) {
    classes.push(`leading-[${props.lineHeight}px]`);
  }
  return optimizeClasses(classes);
}
