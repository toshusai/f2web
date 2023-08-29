import { parseRgba } from "./parseRgba";

export function rgbaToHex(rgba: string) {
  const { r, g, b, a } = parseRgba(rgba);
  return `#${Math.round(r).toString(16)}${Math.round(g).toString(
    16
  )}${Math.round(b).toString(16)}${Math.round(a * 255).toString(16)}`;
}
