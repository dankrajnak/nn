// @flow
import React from "react";
import Colors from "../../Services/ColorService";
import {
  type Perceptron as PerceptronType,
  type Node as NodeType,
  type Edge as EdgeType,
  type EdgeLayer,
  type NodeLayer
} from "../../Domain/Perceptron";
import generateGraph, {
  type GraphNode,
  type GraphLayer,
  type Graph
} from "../../Services/PerceptronGraph";

const NODE_RADIUS = 5;
const Node = (props: { graphNode: GraphNode, node: NodeType }) => (
  <circle
    cx={props.graphNode.x}
    cy={props.graphNode.y}
    r={NODE_RADIUS}
    fill={Colors.offWhite}
    opacity={props.node.activation}
  />
);

const Layer = (props: { graphLayer: GraphLayer, layer: NodeLayer }) =>
  props.layer.entities.map((node, index) => {
    const graphNode = props.graphLayer.get(index);
    if (graphNode) {
      return <Node key={index} graphNode={graphNode} node={node} />;
    }
    return null;
  });

const Edge = (props: { a: GraphNode, b: GraphNode, edge: EdgeType }) => (
  <line
    x1={props.a.x}
    y1={props.a.y}
    x2={props.b.x}
    y2={props.b.y}
    stroke={Colors.offWhite}
    opacity={props.edge.weight}
  />
);

const Edges = (props: { perceptron: PerceptronType, graph: Graph }) => {
  //Iterate through all the edges in perceptron
  return props.perceptron.map((layer: EdgeLayer, layerIndex) => {
    if (!layer.isNodeLayer) {
      return layer.entities.map(edge => {
        const a = props.graph.getIn([layerIndex - 1, edge.backwardNode]);
        const b = props.graph.getIn([layerIndex, edge.forwardNode]);
        if (a && b) {
          return <Edge a={a} b={b} edge={edge} />;
        }
        return null;
      });
    }
    return null;
  });
};

const Perceptron = (props: {
  perceptron: PerceptronType,
  width: number,
  height: number
}) => {
  const graph = generateGraph(props.perceptron, props.width, props.height);
  return (
    <svg width={props.width} height={props.height}>
      {props.perceptron
        .filter(layer => layer.isNodeLayer)
        .map((layer: NodeLayer, index) => {
          const graphLayer = graph.get(index);
          if (graphLayer) {
            return (
              <>
                <Edges perceptron={props.perceptron} graph={graph} />
                <Layer key={index} layer={layer} graphLayer={graphLayer} />
              </>
            );
          }
        })}
    </svg>
  );
};

export default Perceptron;
