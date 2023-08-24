export function isMixed(mixed: any): mixed is typeof figma.mixed {
  if (typeof figma === 'undefined') {
    return false;
  }
  return mixed === figma.mixed;
}
