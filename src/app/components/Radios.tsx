import React from "react";

export function Radios(props: {
  name: string;
  items: { label: string; value: string }[];
  active: string;
  onClick: (value: string) => void;
}) {
  return (
    <div>
      <div>{props.name}</div>
      <div>
        {props.items.map((x) => (
          <div key={x.value}>
            <input
              id={x.value}
              type="radio"
              name={props.name}
              value={x.value}
              checked={props.active === `${props.name}=${x.value}`}
              onChange={() => props.onClick(x.value)}
            />
            <label htmlFor={x.value}>{x.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
