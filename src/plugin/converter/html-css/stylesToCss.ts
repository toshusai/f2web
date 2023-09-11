import { Properties } from "../../types/Properties";

export function stylesToCss(name: string, props: Partial<Properties>) {
  let css = ``;

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
    css += `border-bottom-left-radius: ${props.borderBottomLeftRadius}px;\n`;
  }
  if (props.borderBottomRightRadius) {
    css += `border-bottom-right-radius: ${props.borderBottomRightRadius}px;\n`;
  }
  if (props.borderBottomWidth) {
    css += `border-bottom-width: ${props.borderBottomWidth}px;\n`;
  }
  if (props.borderColor) {
    css += `border-color: ${props.borderColor};\n`;
  }
  if (props.borderLeftWidth) {
    css += `border-left-width: ${props.borderLeftWidth}px;\n`;
  }
  if (props.borderRightWidth) {
    css += `border-right-width: ${props.borderRightWidth}px;\n`;
  }
  if (props.borderTopLeftRadius) {
    css += `border-top-left-radius: ${props.borderTopLeftRadius}px;\n`;
  }
  if (props.borderTopRightRadius) {
    css += `border-top-right-radius: ${props.borderTopRightRadius}px;\n`;
  }
  if (props.borderTopWidth) {
    css += `border-top-width: ${props.borderTopWidth}px;\n`;
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
    }
    css += `display: ${props.display};\n`;
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
      css += `width: ${props.width};\n`;
    }
  }
  css = css
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  css = `.${name} {\n${css}}`;
  return css;
}
