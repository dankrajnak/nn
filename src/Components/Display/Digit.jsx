// @flow
import React from "react";
import styled from "styled-components";

type Props = {
  digit: ?Array<Array<number>>
};
const Pixel = styled.div.attrs(({ pixel }) => ({
  background: `rgb(${pixel}, ${pixel}, ${pixel});`
}))`
  &:hover {
    border: solid red 1px;
  }
  background: ${props => props.background};
  color: "white";
  alignself: "stretch";
  fontsize: ".8em";
`;

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
        row.map((pixel, ci) => <Pixel key={`${ri}-${ci}`} pixel={pixel} />)
      )}
    </div>
  );
};

export default Digit;
