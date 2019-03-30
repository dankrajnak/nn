// @flow
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DarkBox from "./Components/Display/DarkBox.jsx";
import useFullScreen from "./Hooks/useFullScreen";
import Perceptron from "./Components/Display/Perceptron.jsx";
import {
  createPerceptron,
  randomizeEdgeWeights
} from "./Domain/Perceptron.mock";
import DataService from "./Services/DataService.js";
import Digit from "./Components/Display/Digit.jsx";

const perceptron = randomizeEdgeWeights(
  createPerceptron([2, 16, 16, 10], true)
);

const CenterIt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [width, height] = useFullScreen();
  const [image, setImage] = useState(null);
  useEffect(() => {
    const service = new DataService("/static/binary.bin");
    let index = 4;
    service.init(2051).then(() => {
      service.getImage(index++).then(setImage);
      setInterval(() => {
        service.getImage(index++).then(setImage);
      }, 4000);
    });
  }, []);
  return (
    <>
      <DarkBox
        style={{
          width: `${width}px`,
          height: `${height * 0.8}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Perceptron
          perceptron={perceptron}
          width={width * 0.9}
          height={height * 0.8}
        />
      </DarkBox>

      <article style={{ marginBottom: "40px" }}>
        <hgroup>
          <h2 className="alignCenter">An Article About Neural Networks</h2>
          <CenterIt>
            <p className="attention-grabber">
              <em className="alignCenter">
                Oh god. We&rsquo;ll get through this together.
              </em>
            </p>
          </CenterIt>
        </hgroup>
        <p>
          Our goal is to write a program to recognize hand-written digits. These
          digits made up of 24 rows and 24 columns of pixels. Each pixel is a
          number specifying how white or black the pixel is. They look like
          this:
        </p>
        {image && (
          <CenterIt>
            <figure>
              <Digit digit={image} />
              <figcaption>Data provided via the MINST database</figcaption>
            </figure>
          </CenterIt>
        )}
        <p>
          This is the type of problem that neural networks excel at, but imagine
          we needed to do this without one. How would you go about coding it?
        </p>
      </article>
    </>
  );
};

export default App;
