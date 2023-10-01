import { Properties } from "../../types/Properties";

function optimizeCss(props: Partial<Properties>) {
  const newProps: Partial<Properties> = {
    ...props,
  };

  if (
    newProps.borderBottomLeftRadius === newProps.borderBottomRightRadius &&
    newProps.borderBottomLeftRadius === newProps.borderTopLeftRadius &&
    newProps.borderBottomLeftRadius === newProps.borderTopRightRadius
  ) {
    newProps.borderRadius = newProps.borderBottomLeftRadius;
    delete newProps.borderBottomLeftRadius;
    delete newProps.borderBottomRightRadius;
    delete newProps.borderTopLeftRadius;
    delete newProps.borderTopRightRadius;
  }

  if (
    newProps.borderBottomWidth === newProps.borderTopWidth &&
    newProps.borderBottomWidth === newProps.borderLeftWidth &&
    newProps.borderBottomWidth === newProps.borderRightWidth
  ) {
    newProps.borderWidth = newProps.borderBottomWidth;
    delete newProps.borderBottomWidth;
    delete newProps.borderTopWidth;
    delete newProps.borderLeftWidth;
    delete newProps.borderRightWidth;
  }

  if (
    newProps.paddingBottom === newProps.paddingTop &&
    newProps.paddingBottom === newProps.paddingLeft &&
    newProps.paddingBottom === newProps.paddingRight
  ) {
    newProps.padding = newProps.paddingBottom;
    delete newProps.paddingBottom;
    delete newProps.paddingTop;
    delete newProps.paddingLeft;
    delete newProps.paddingRight;
  }

  if (
    newProps.paddingLeft !== undefined &&
    newProps.paddingTop !== undefined &&
    newProps.paddingLeft === newProps.paddingRight &&
    newProps.paddingTop === newProps.paddingBottom &&
    newProps.paddingLeft !== newProps.paddingTop
  ) {
    newProps.padding = [newProps.paddingTop, newProps.paddingLeft];
    delete newProps.paddingLeft;
    delete newProps.paddingTop;
    delete newProps.paddingRight;
    delete newProps.paddingBottom;
  }

  if (newProps.justifyContent === "start") {
    delete newProps.justifyContent;
  }
  if (newProps.alignItems === "start") {
    delete newProps.alignItems;
  }

  if (newProps.textAlign === "left") {
    delete newProps.textAlign;
  }
  if (newProps.fontWeight === 400) {
    delete newProps.fontWeight;
  }
  return newProps;
}

export function stylesToCssString(_props: Partial<Properties>) {
  const props = optimizeCss(_props);
  let css = ``;
  let before = ``;

  if (
    props.boxSizing &&
    (props.padding !== undefined ||
      props.paddingTop !== undefined ||
      props.paddingBottom !== undefined ||
      props.paddingLeft !== undefined ||
      props.paddingRight !== undefined)
  ) {
    css += `box-sizing: ${props.boxSizing};\n`;
  }
  if (props.alignItems) {
    css += `align-items: ${props.alignItems};\n`;
  }
  if (props.backgroundColor) {
    if (props.backgroundColor.startsWith("linear-gradient")) {
      css += `background-image: ${props.backgroundColor};\n`;
    } else if (props.backgroundColor.startsWith("#")) {
      css += `background-color: ${props.backgroundColor};\n`;
    } else {
      css += `background-color: var(--${props.backgroundColor});\n`;
    }
  }
  if (props.borderBottomLeftRadius) {
    before += `border-bottom-left-radius: ${props.borderBottomLeftRadius}px;\n`;
    css += `border-bottom-left-radius: ${props.borderBottomLeftRadius}px;\n`;
  }
  if (props.borderBottomRightRadius) {
    before += `border-bottom-right-radius: ${props.borderBottomRightRadius}px;\n`;
    css += `border-bottom-right-radius: ${props.borderBottomRightRadius}px;\n`;
  }
  if (props.borderBottomWidth) {
    before += `border-bottom-width: ${props.borderBottomWidth}px;\n`;
    before += `border-bottom-style: solid;\n`;
  }
  if (props.borderColor) {
    if (props.borderColor.startsWith("#")) {
      before += `border-color: ${props.borderColor};\n`;
    } else {
      before += `border-color: var(--${props.borderColor});\n`;
    }
  }
  if (props.borderLeftWidth) {
    before += `border-left-width: ${props.borderLeftWidth}px;\n`;
    before += `border-left-style: solid;\n`;
  }
  if (props.borderRightWidth) {
    before += `border-right-width: ${props.borderRightWidth}px;\n`;
    before += `border-right-style: solid;\n`;
  }
  if (props.borderTopLeftRadius) {
    before += `border-top-left-radius: ${props.borderTopLeftRadius}px;\n`;
    css += `border-top-left-radius: ${props.borderTopLeftRadius}px;\n`;
  }
  if (props.borderTopRightRadius) {
    before += `border-top-right-radius: ${props.borderTopRightRadius}px;\n`;
    css += `border-top-right-radius: ${props.borderTopRightRadius}px;\n`;
  }
  if (props.borderTopWidth) {
    before += `border-top-width: ${props.borderTopWidth}px;\n`;
    before += `border-top-style: solid;\n`;
  }
  if (props.borderRadius) {
    css += `border-radius: ${props.borderRadius}px;\n`;
  }
  if (props.borderWidth) {
    css += `border-width: ${props.borderWidth}px;\n`;
  }
  if (props.padding) {
    if (typeof props.padding === "number") {
      css += `padding: ${props.padding}px;\n`;
    } else {
      css += `padding: ${props.padding[0]}px ${props.padding[1]}px;\n`;
    }
  }
  if (props.bottom) {
    css += `bottom: ${props.bottom}px;\n`;
  }
  if (props.boxShadow) {
    css += `box-shadow: ${props.boxShadow};\n`;
  }
  if (props.color) {
    if (props.color.startsWith("#")) {
      css += `color: ${props.color};\n`;
    } else {
      css += `color: var(--${props.color});\n`;
    }
  }
  if (props.display) {
    if (props.display === "hidden") {
      css += `display: none;\n`;
    } else {
      css += `display: ${props.display};\n`;
    }
  }
  if (props.flexDirection) {
    css += `flex-direction: ${props.flexDirection};\n`;
  }
  if (props.fontSize) {
    css += `font-size: ${props.fontSize}px;\n`;
  }
  if (props.fontWeight) {
    css += `font-weight: ${props.fontWeight};\n`;
  }
  if (props.gap) {
    css += `gap: ${props.gap}px;\n`;
  }
  if (props.height) {
    if (props.height === "fit") {
      css += `height: fit-content;\n`;
    } else if (props.height === "full") {
      css += `height: 100%;\n`;
    } else {
      css += `height: ${props.height}px;\n`;
    }
  }
  if (props.justifyContent) {
    if (props.justifyContent === "between") {
      css += `justify-content: space-between;\n`;
    } else {
      css += `justify-content: ${props.justifyContent};\n`;
    }
  }
  if (props.left) {
    css += `left: ${props.left}px;\n`;
  }
  if (props.lineHeight) {
    css += `line-height: ${props.lineHeight}px;\n`;
  }
  if (props.maxHeight) {
    css += `max-height: ${props.maxHeight}px;\n`;
  }
  if (props.maxWidth) {
    css += `max-width: ${props.maxWidth}px;\n`;
  }
  if (props.minHeight) {
    css += `min-height: ${props.minHeight}px;\n`;
  }
  if (props.minWidth) {
    css += `min-width: ${props.minWidth}px;\n`;
  }
  if (props.paddingBottom) {
    css += `padding-bottom: ${props.paddingBottom}px;\n`;
  }
  if (props.paddingLeft) {
    css += `padding-left: ${props.paddingLeft}px;\n`;
  }
  if (props.paddingRight) {
    css += `padding-right: ${props.paddingRight}px;\n`;
  }
  if (props.paddingTop) {
    css += `padding-top: ${props.paddingTop}px;\n`;
  }
  if (props.position) {
    css += `position: ${props.position};\n`;
  }
  if (props.right) {
    css += `right: ${props.right}px;\n`;
  }
  if (props.textAlign) {
    css += `text-align: ${props.textAlign};\n`;
  }
  if (props.top) {
    css += `top: ${props.top}px;\n`;
  }
  if (props.width) {
    if (props.width === "fit") {
      css += `width: fit-content;\n`;
    } else if (props.width === "full") {
      css += `width: 100%;\n`;
    } else {
      css += `width: ${props.width}px;\n`;
    }
  }
  if (
    props.borderBottomWidth ||
    props.borderLeftWidth ||
    props.borderRightWidth ||
    props.borderTopWidth
  ) {
    before += `content: "";\n`;
    before += `position: absolute;\n`;
    before += `width: 100%;\n`;
    before += `height: 100%;\n`;
    before += `inset: 0;\n`;
  }

  return {
    css: css.trimEnd(),
    before: before.trimEnd(),
  };
}
