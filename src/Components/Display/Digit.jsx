// @flow
import React, { useRef, type ComponentType } from "react";
import Canvas from "./Canvas.jsx";
import useHover from "../../Hooks/useHover";

type Props = {
  digit: ?Array<Array<number>>,
  pixelSize?: ?number
};

export default (React.memo(function Digit({ digit, pixelSize }: Props) {
  const canvas = useRef(null);

  const size = pixelSize || 8;
  const artist = (
    ctx: CanvasRenderingContext2D,
    coordinates?: { x: number, y: number }
  ) => {
    if (digit) {
      digit.forEach((row, ri) =>
        row.forEach((pixel, pi) => {
          if (
            coordinates &&
            coordinates.x >= pi * size &&
            coordinates.x < (pi + 1) * size &&
            coordinates.y >= ri * size &&
            coordinates.y < (ri + 1) * size
          ) {
            ctx.fillStyle = `red`;
          } else {
            ctx.fillStyle = `rgb(${pixel}, ${pixel}, ${pixel})`;
          }

          ctx.fillRect(pi * size, ri * size, size, size);
        })
      );
    }
  };

  let handleHover = () => null;

  if (canvas && canvas.current) {
    const context = canvas.current.getContext("2d");
    artist(context);
    handleHover = coordinates =>
      requestAnimationFrame(() => artist(context, coordinates));
  }
  useHover(canvas, handleHover);

  if (!digit) {
    return null;
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
