export enum AttrType {
  VARIABLE = "variable",
  VALUE = "value",
}

export type AttrValue = {
  type: AttrType;
  value: string;
  variants?: Record<string, AttrValue>;
};

export type Variants = {
  key: string;
  value: string;
};
