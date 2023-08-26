import { Layout } from "./Layout";
import { Align } from "./Align";

export type LayoutProps = {
  layout?: Layout;
  gap?: number | "auto";
  align?: Align;
  paddingHorizon?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
};
