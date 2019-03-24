// @flow
import { List } from "immutable";
import { type Perceptron } from "./Perceptron";
import { addLayer, createNodeLayer, createNode } from "./Perceptron.service";

export const simple: Perceptron = List([
  createNodeLayer(List([createNode(1, 0.5), createNode(0.2, 20)]))
]);

// $FlowFixMe
export const twoLayers = addLayer(simple, simple.get(0));
