// @flow
import React from "react";
import DarkBox from "./Components/Display/DarkBox.jsx";
import Card from "./Components/Display/Card.jsx";
import useFullScreen from "./Hooks/useFullScreen";
import Perceptron from "./Components/Display/Perceptron.jsx";
import { twoLayers } from "./Domain/Perceptron.mock";
const App = () => {
  const [width, height] = useFullScreen();
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
          perceptron={twoLayers}
          width={width * 0.9}
          height={height * 0.8}
        />
      </DarkBox>
      <Card />
    </>
  );
};

export default App;
