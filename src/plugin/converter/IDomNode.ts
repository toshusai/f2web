
export type IDomNode = {
  childNodes: IDomNode[];
  attributes: { name: string; value: string; }[];
  nodeName: string;
};
