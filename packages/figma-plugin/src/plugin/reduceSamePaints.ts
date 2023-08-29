import { ColorVariable } from "./ColorVariable";


export function reduceSamePaints(paints: ColorVariable[]) {
  const map = new Map<string, ColorVariable>();
  paints.forEach((paint) => {
    const key = JSON.stringify(paint);
    if (map.has(key)) {
    } else {
      map.set(key, paint);
    }
  });
  return Array.from(map.values());
}
