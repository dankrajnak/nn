// @flow
import { List } from "immutable";
import type { Perceptron, Node, EdgeLayer } from "./Perceptron";
import { addLayer, createNodeLayer, createNode } from "./Perceptron.service";

const nodeList = (numberNodes: number, random: boolean = false): List<Node> => {
  let list = List();
  for (let i = 0; i < numberNodes; i++) {
    list = list.push(createNode(random ? Math.random() : 1, 0));
  }
  return list;
};

/**
 * Creates a perceptron with the given amount of nodes in each layer.
 * For example, when layers = [2, 2], this will output
 * a perceptron with two layers, each of size two.
 * @param {number[]} layers -- an array specifying the structure of the Perceptron
 * @param {boolean} random -- whether to initialize the Perceptron with random activations
 */
export const createPerceptron = (
  layers: number[],
  random: boolean = false
): Perceptron => {
  const nodeLayers = layers.map(layer =>
    createNodeLayer(nodeList(layer, random))
  );
  const initialValue = List([nodeLayers[0]]);

  return nodeLayers
    .slice(1)
    .reduce((sum, val) => addLayer(sum, val), initialValue);
};

export const randomizeEdgeWeights = (perceptron: Perceptron): Perceptron =>
  perceptron.map(layer => {
    if (layer.isNodeLayer) {
      return layer;
    } else {
      return {
        ...layer,
        entities: (layer: EdgeLayer).entities.map(entity => ({
          ...entity,
          weight: Math.random()
        }))
      };
    }
  });
