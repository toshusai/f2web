import { Size } from "./Size";

export type DimensionPorps = {
  width?: number | Size;
  maxWidth?: number;
  minWidth?: number;
  height?: number | Size;
  maxHeight?: number;
  minHeight?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  borderRadius?: number;
  overflow?: "hidden" | "scroll" | "auto";
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
};
