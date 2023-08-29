export function nullToUndefinedRecursive(obj) {
  if (obj === null) return undefined;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => nullToUndefinedRecursive(item));
  }
  const newObj = {};
  for (const key in obj) {
    newObj[key] = nullToUndefinedRecursive(obj[key]);
  }
  return newObj;
}
