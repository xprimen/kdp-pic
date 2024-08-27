import React, { HTMLAttributes } from "react";

const AnimateSlideIn = (
  props: React.PropsWithChildren<
    HTMLAttributes<HTMLDivElement> & { direction: "left" | "right" }
  >
) => {
  const { children, className, direction, ...restProps } = props;
  const directionAnimate =
    direction === "left" ? "animate-slide-in-left" : "animate-slide-in-right";
  return (
    <div
      // className={`animate-slide-in-${direction} ${className || ""}`}
      className={`${directionAnimate} ${className || ""}`}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default AnimateSlideIn;
