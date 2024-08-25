import React, { HTMLAttributes } from "react";

const AnimateSlideInRight = (
  props: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>
) => {
  const { children, className, ...restProps } = props;
  return (
    <div
      className={`animate-main-page-transition border border-slate-300 ${className}`}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default AnimateSlideInRight;
