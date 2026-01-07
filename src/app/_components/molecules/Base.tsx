import React from "react";
import clsx from "clsx";
export type BaseProps = {
  className?: string;
};
const Base: React.FC<BaseProps> = ({ className }) => {
  return <div className={clsx("", className)}>Base</div>;
};

export default Base;
