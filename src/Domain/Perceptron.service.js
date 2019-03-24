// @flow
import { List } from "immutable";
import {
  type Node,
  type Edge,
  type NodeLayer,
  type EdgeLayer,
  type Perceptron
} from "./Perceptron";

export const createNode = (activation: number, bias: number): Node => ({
  activation,
  bias
});

const createEdge = (
  weight: number,
  backwardNode: number,
  forwardNode: number
): Edge => ({
  weight,
  forwardNode,
  backwardNode
});

export const createEdgeLayer = (edges: List<Edge>): EdgeLayer => ({
  isNodeLayer: false,
  entities: edges
});

export const createNodeLayer = (nodes: List<Node>): NodeLayer => ({
  isNodeLayer: true,
  entities: nodes
});

export const addLayer = (
  perceptron: Perceptron,
  newLayer: NodeLayer,
  newEdgeWeight: number = 1
): Perceptron => {
  if (perceptron.size === 0) {
    return List([newLayer]);
  }

  // This is a little complicated.  We need to create an edge for every connection
  // between the two layers.  Each node is connected to every other node in the next layer
  // So, if layer 1 has 5 nodes, and the other has three, we need to make 15 edges.
  // We do this through nested reducers, which iterate through the last layer in
  // the current network and the new layer.
  const edgeLayer: EdgeLayer = createEdgeLayer(
    perceptron
      .last()
      .entities.reduce(
        (edgesA, pNode, pIndex) =>
          edgesA.concat(
            newLayer.entities.reduce(
              (edgesB, newNode, newIndex) =>
                edgesB.push(createEdge(newEdgeWeight, pIndex, newIndex)),
              List()
            )
          ),
        List()
      )
  );

  //Add an edge layer, and then the new layer.
  return perceptron.push(edgeLayer).push(newLayer);
};
