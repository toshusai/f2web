export function parseRgba(rgba: string) {
  const [r, g, b, a] = rgba
    .replace("rgba(", "")
    .replace(")", "")
    .replace(/ /g, "")
    .split(",")
    .map((v) => parseFloat(v));
  return { r, g, b, a };
}
