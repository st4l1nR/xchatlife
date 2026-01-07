import React from "react";
import clsx from "clsx";

export type props = {
  className?: string;
  loading: boolean;
  totalDocs?: number;
  children: any;
};

const WrapperLoader: React.FC<props> = ({
  className,
  loading,
  totalDocs,
  children,
}) => {
  const childrens = React.Children.toArray(children);
  return (
    <div className={clsx("", className)}>
      {loading
        ? childrens[1]
        : totalDocs == 0
          ? children[2]
          : loading == false && totalDocs && children[0]}
    </div>
  );
};

export default WrapperLoader;
