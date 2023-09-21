export type Props = {
  [key: string]: {
    type: PropType;
    defaultValue?: string;
  };
};

export type PropType = TypeOf | Union | Instance | Native;
type TypeOf = {
  type: "typeof";
  typeName: string;
  propName: string;
  optional?: boolean;
};
type Union = {
  type: "union";
  types: string[];
};
type Instance = {
  type: "INSTANCE";
};
type Native = {
  type: "native";
  value: "string" | "boolean";
  optional?: boolean;
};
