import { isSymbol } from "./isSymbol";


export function dropSymbolRecursively(obj: any) {
  if (typeof obj !== "object" || obj === null) return obj;
  try {
    Object.keys(obj).forEach((key) => {
      if (obj[key] instanceof Symbol ||
        isSymbol(obj[key]) ||
        typeof obj[key] === "symbol") {
        delete obj[key];
      }
      if (typeof obj[key] === "object") {
        dropSymbolRecursively(obj[key]);
      }
    });
  } catch (e) { }
  return obj;
}
