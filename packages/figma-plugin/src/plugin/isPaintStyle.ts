
export function isPaintStyle(style: BaseStyle): style is PaintStyle {
  return style.type === "PAINT";
}
