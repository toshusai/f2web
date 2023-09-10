import { removeHyphen } from "../utils/removeHyphen";

export function convertToCssAvairableName(name: string) {
  return removeHyphen(name.replace(/[^a-zA-Z0-9-]/g, "-"));
}
