import React from "react";
import { classes } from "./Button";

export function Tab(props: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={props.onClick}
      className={classes("tab", props.active && "tab-active")}
    >
      {props.children}
    </div>
  );
}
