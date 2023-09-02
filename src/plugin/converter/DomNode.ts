import { AttrValue } from "./AttrValue";
import { TextDomNode } from "./TextDomNode";

export type DomNode =
  | {
      type: string;
      attrs?: Record<string, AttrValue>;
      children?: DomNode[];
      variants?: Record<string, DomNode>; // use for varinat <key=value, type>
      name?: string; // use for variant key=value
    }
  | TextDomNode;
