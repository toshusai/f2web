import { AttrValue } from "./AttrValue";
import { Properties } from "./Properties";
import { TextDomNode } from "./TextDomNode";

export type DomNode =
  | {
      type: string;
      attrs?: Record<string, AttrValue>;
      children?: DomNode[];
      variants?: Record<string, DomNode>; // use for varinat <key=value, type>
      styles?: Partial<Properties>;
      name?: string; // use for variant key=value
    }
  | TextDomNode;
