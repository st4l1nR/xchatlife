import clsx from "clsx";
import React from "react";

export const Spinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={clsx(props.className, "animate-spin")}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="25.13"
        strokeDashoffset="25.13"
        fill="none"
      />
    </svg>
  );
};
