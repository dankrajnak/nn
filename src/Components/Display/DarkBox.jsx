// @flow
import React, { type Node } from "react";
import styled from "styled-components";

const DarkDiv = styled.div`
  background: rgb(60, 44, 66);
  background: radial-gradient(
    circle,
    rgba(60, 44, 66, 1) 5%,
    rgba(29, 19, 37, 1) 100%
  );
`;

const DarkContainer = (props: { children?: Node }) => {
  const { children, ...otherProps } = props;
  return <DarkDiv {...otherProps}> {children}</DarkDiv>;
};

export default DarkContainer;
