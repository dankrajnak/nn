// @flow
import React, { type ComponentType } from "react";

type Props = {
  width: number,
  height: number
};

export default (React.memo(
  React.forwardRef(function Canvas(props: Props, ref) {
    return (
      <canvas
        ref={ref}
        width={`${props.width}px`}
        height={`${props.height}px`}
      />
    );
  })
): ComponentType<Props>);
