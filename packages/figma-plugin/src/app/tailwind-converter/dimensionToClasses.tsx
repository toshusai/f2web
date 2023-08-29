import { DimensionPorps, Size } from "../../../../core/src";

export function dimensionToClasses(props: DimensionPorps) {
  const classes: string[] = [];
  if (props.width !== undefined) {
    if (props.width === Size.Fill) {
      classes.push(`w-full`);
    } else if (props.width === Size.Hug) {
      classes.push(`w-auto`);
    } else {
      classes.push(`w-[${props.width}px]`);
    }
  }
  if (props.height !== undefined) {
    if (props.height === Size.Fill) {
      classes.push(`h-full`);
    } else if (props.height === Size.Hug) {
      classes.push(`h-fit`);
    } else {
      classes.push(`h-[${props.height}px]`);
    }
  }
  if (props.minWidth !== undefined) {
    classes.push(`min-w-[${props.minWidth}px]`);
  }
  if (props.minHeight !== undefined) {
    classes.push(`min-h-[${props.minHeight}px]`);
  }
  if (props.maxWidth !== undefined) {
    classes.push(`max-w-[${props.maxWidth}px]`);
  }
  if (props.maxHeight !== undefined) {
    classes.push(`max-h-[${props.maxHeight}px]`);
  }

  if (
    props.top !== undefined ||
    props.bottom !== undefined ||
    props.left !== undefined ||
    props.right !== undefined
  ) {
    classes.push(`absolute`);
  } else {
    classes.push(`relative`);
  }

  if (props.bottom !== undefined) {
    classes.push(`bottom-[${props.bottom}px]`);
  }
  if (props.left !== undefined) {
    classes.push(`left-[${props.left}px]`);
  }
  if (props.right !== undefined) {
    classes.push(`right-[${props.right}px]`);
  }
  if (props.top !== undefined) {
    classes.push(`top-[${props.top}px]`);
  }

  if (props.borderRadius !== undefined) {
    classes.push(`rounded-[${props.borderRadius}px]`);
  }

  if (props.borderBottomLeftRadius !== undefined) {
    classes.push(`rounded-bl-[${props.borderBottomLeftRadius}px]`);
  }
  if (props.borderBottomRightRadius !== undefined) {
    classes.push(`rounded-br-[${props.borderBottomRightRadius}px]`);
  }
  if (props.borderTopLeftRadius !== undefined) {
    classes.push(`rounded-tl-[${props.borderTopLeftRadius}px]`);
  }
  if (props.borderTopRightRadius !== undefined) {
    classes.push(`rounded-tr-[${props.borderTopRightRadius}px]`);
  }

  if (props.overflow !== undefined) {
    classes.push(`overflow-${props.overflow}`);
  }

  return classes;
}
