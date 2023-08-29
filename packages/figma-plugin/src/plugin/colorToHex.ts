
export function colorToHex(color: RGB, alpha: number) {
  return `#${Math.round(color.r * 255).toString(16)}${Math.round(
    color.g * 255
  ).toString(16)}${Math.round(color.b * 255).toString(16)}${Math.round(
    alpha * 255
  ).toString(16)}`;
}
