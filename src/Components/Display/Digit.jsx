// @flow
import React, { useRef, type ComponentType } from "react";
import Canvas from "./Canvas.jsx";

type Props = {
  digit: ?Array<Array<number>>,
  pixelSize?: ?number
};

export default (React.memo(function Digit({ digit, pixelSize }: Props) {
  const canvas = useRef(null);
  if (!digit) {
    return null;
  }

  const size = pixelSize || 8;
  const artist = (ctx: CanvasRenderingContext2D) => {
    digit.forEach((row, ri) =>
      row.forEach((pixel, pi) => {
        ctx.fillStyle = `rgb(${pixel}, ${pixel}, ${pixel})`;
        ctx.fillRect(pi * size, ri * size, size, size);
      })
    );
  };

  if (canvas && canvas.current) {
    artist(canvas.current.getContext("2d"));
    canvas.current;
  }

  return (
    <Canvas
      ref={canvas}
      artist={artist}
      width={size * digit.length}
      height={size * digit.length}
    />
  );
}): ComponentType<Props>);
