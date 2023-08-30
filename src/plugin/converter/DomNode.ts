import { AttrValue } from "./AttrValue";
import { TextDomNode } from "./TextDomNode";

export type DomNode =
  | {
      type: string;
      attrs?: Record<string, AttrValue>;
      children?: DomNode[];
    }
  | TextDomNode;
