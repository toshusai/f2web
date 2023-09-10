/**
 * https://github.com/avaer/text-encoder/tree/master
 * MIT License
 */

const utf8Encodings = ["utf8", "utf-8", "unicode-1-1-utf-8"];

export class TextDecoder {
  encoding: string;

  constructor(encoding: string) {
    if (
      utf8Encodings.indexOf(encoding) < 0 &&
      typeof encoding !== "undefined" &&
      encoding != null
    ) {
      throw new RangeError("Invalid encoding type. Only utf-8 is supported");
    } else {
      this.encoding = "utf-8";
    }
  }

  decode(view: ArrayBufferView, options?: { stream?: boolean }): string {
    if (typeof view === "undefined") {
      return "";
    }

    const stream =
      typeof options !== "undefined" && "stream" in options
        ? options.stream
        : false;
    if (typeof stream !== "boolean") {
      throw new TypeError("stream option must be boolean");
    }

    if (!ArrayBuffer.isView(view)) {
      throw new TypeError("passed argument must be an array buffer view");
    } else {
      const arr = new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
        charArr = new Array(arr.length);
      for (let i = 0; i < arr.length; i++) {
        charArr[i] = String.fromCharCode(arr[i]);
      }
      return decodeURIComponent(escape(charArr.join("")));
    }
  }
}
