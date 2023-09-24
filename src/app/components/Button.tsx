import React from "react";

export function Button(props: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes("btn", props.disabled && "btn-disabled")}
    >
      {props.children}
    </button>
  );
}

export function classes(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
