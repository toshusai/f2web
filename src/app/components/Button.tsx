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
      className={`py-[4px] px-[12px] bg-blue-500 rounded-full text-white text-[16px]${
        props.disabled ? " opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {props.children}
    </button>
  );
}
