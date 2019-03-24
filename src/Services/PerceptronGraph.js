// @flow
import { List } from "immutable";
import { type Perceptron } from "../Domain/Perceptron";
// For performance purposes, it makes sense to generate a store of coordinates
// for every node in the graph. This store will have the following format:
export type GraphNode = {| +x: number, +y: number |};
export type GraphLayer = List<GraphNode>;
export type Graph = List<GraphLayer>;

const generateGraph = (
  perceptron: Perceptron,
  width: number,
  height: number
): Graph =>
  perceptron
    .map((layer, layerIndex) => {
      if (layer.isNodeLayer) {
        return layer.entities.map((node, nodeIndex) => ({
          x: ((layerIndex + 1) * width) / (perceptron.size + 1),
          y: ((nodeIndex + 1) * height) / (layer.entities.size + 1)
        }));
      } else {
        return List();
      }
    })
    .filter(val => val.size);

export default generateGraph;
