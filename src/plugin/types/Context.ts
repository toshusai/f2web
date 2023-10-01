import { Colors } from "../Colors";
import { DomMeta } from "./DomMeta";
import { Props } from "./Props";

export type Context = {
  root: ComponentSetNode;
  storyLayout: "centered" | "fullscreen" | "padded";
  ignoreInstance: boolean;
  name: string;
  props?: Props;
  colors?: Colors[];
  images?: {
    [key: string]: Uint8Array;
  };
  dependencies?: {
    [key: string]: string;
  };
  depth?: number;
  meta?: DomMeta;

  svgCache: Record<string, string>;
};
