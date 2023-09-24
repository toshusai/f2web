import React from "react";
import { Tab } from "./Tab";


export function Tabs(props: {
  items: { label: string; value: string; }[];
  active: string;
  onClick: (value: string) => void;
}) {
  return (
    <div className="tabs">
      {props.items.map((x) => (
        <Tab
          key={x.value}
          active={x.value === props.active}
          onClick={() => props.onClick(x.value)}
        >
          {x.label}
        </Tab>
      ))}
    </div>
  );
}
