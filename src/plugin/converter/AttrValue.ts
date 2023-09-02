export type AttrValue = {
  type: "variable" | "value";
  value: string;
  variants?: Record<string, AttrValue>;
};

export type Variants = {
  key: string;
  value: string;
};
