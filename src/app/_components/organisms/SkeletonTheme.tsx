"use client";

import { SkeletonTheme as ReactSkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonThemeProps = {
  children: React.ReactNode;
};

const SkeletonTheme: React.FC<SkeletonThemeProps> = ({ children }) => {
  return (
    <ReactSkeletonTheme
      baseColor="var(--color-muted)"
      highlightColor="var(--color-muted-foreground)"
    >
      {children}
    </ReactSkeletonTheme>
  );
};

export default SkeletonTheme;
