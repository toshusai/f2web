import React from "react";

export function Tab(props: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={props.onClick}
      className={`py-[8px] px-[16px] ${
        props.active ? "bg-[#b93535]" : ""
      } cursor-pointer`}
    >
      {props.children}
    </div>
  );
}
