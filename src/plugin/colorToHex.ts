const toHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export function colorToHex(color: RGB, alpha: number) {
  return `#${toHex(Math.round(color.r * 255))}${toHex(
    Math.round(color.g * 255)
  )}${toHex(Math.round(color.b * 255))}${toHex(Math.round(alpha * 255))}`;
}
