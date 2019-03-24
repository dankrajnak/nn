// @flow
import React from "react";

type Props = {
  digit: ?Array<Array<number>>
};

const Digit = ({ digit }: Props) => {
  if (!digit) {
    return null;
  }
  const columns = digit.length;
  const rows = digit[0].length;
  const pixelHeight = 10;
  const pixelWidth = 10;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${pixelWidth}px `.repeat(columns),
        gridTemplateRows: `${pixelHeight}px `.repeat(rows)
      }}
    >
      {digit.map((row, ri) =>
        row.map((pixel, ci) => (
          <div
            key={`${ri}-${ci}`}
            style={{
              background: `rgb(${pixel}, ${pixel}, ${pixel})`,
              color: "white",
              alignSelf: "stretch",
              fontSize: ".8em"
            }}
          />
        ))
      )}
    </div>
  );
};

export default Digit;
