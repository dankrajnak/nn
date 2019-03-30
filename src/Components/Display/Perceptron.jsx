// @flow
import React, { useState } from "react";
import styled from "styled-components";
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

type ActiveNodes = Array<{ layer: number, node: number }>;
const Perceptron = (props: {
  perceptron: PerceptronType,
  width: number,
  height: number,
  activeNodes?: ActiveNodes
}) => {
  const [activeNodes, setActiveNodes] = useState([]);
  const graph = generateGraph(props.perceptron, props.width, props.height);
  return (
    <svg width={props.width} height={props.height}>
      <Edges
        perceptron={props.perceptron}
        graph={graph}
        activeNodes={activeNodes}
      />
      <Nodes
        perceptron={props.perceptron}
        graph={graph}
        activeNodes={activeNodes}
        onMouseOver={(layer, node) => setActiveNodes([{ layer, node }])}
        onMouseLeave={() => setActiveNodes([])}
      />
    </svg>
  );
};

const Nodes = (props: {
  perceptron: PerceptronType,
  graph: Graph,
  activeNodes?: ActiveNodes,
  muted?: boolean,
  onMouseOver?: (layer: number, node: number) => any,
  onMouseLeave?: (layer: number, node: number) => any
}) =>
  props.perceptron
    .filter(layer => layer.isNodeLayer)
    .map((layer: NodeLayer, index) => {
      const graphLayer = props.graph.get(index);
      const activeNodes =
        props.activeNodes &&
        props.activeNodes
          .filter(node => node.layer === index)
          .map(node => node.node);
      if (graphLayer) {
        return (
          <Layer
            key={index}
            layer={layer}
            graphLayer={graphLayer}
            muted={
              (props.activeNodes &&
                props.activeNodes.length !== 0 &&
                props.activeNodes.every(node => node.layer !== index)) ||
              props.muted
            }
            activeNodes={activeNodes && activeNodes.length ? activeNodes : null}
            onMouseOver={node =>
              props.onMouseOver && props.onMouseOver(index, node)
            }
            onMouseLeave={node =>
              props.onMouseLeave && props.onMouseLeave(index, node)
            }
          />
        );
      }
    });

const Layer = (props: {
  graphLayer: GraphLayer,
  layer: NodeLayer,
  activeNodes?: ?Array<number>,
  muted?: boolean,
  onMouseOver?: (index: number) => any,
  onMouseLeave?: (index: number) => any
}) =>
  props.layer.entities.map((node, index) => {
    const graphNode = props.graphLayer.get(index);
    if (graphNode) {
      return (
        <Node
          key={index}
          graphNode={graphNode}
          node={node}
          muted={
            props.muted ||
            (props.activeNodes
              ? props.activeNodes.every(node => node !== index)
              : false)
          }
          onMouseOver={() => props.onMouseOver && props.onMouseOver(index)}
          onMouseLeave={() => props.onMouseLeave && props.onMouseLeave(index)}
        />
      );
    }
    return null;
  });

const NODE_RADIUS = 5;
const Circle = styled.circle`
  transition: fill-opacity 500ms ease;
`;
const Node = (props: {
  graphNode: GraphNode,
  node: NodeType,
  muted?: boolean,
  onMouseOver?: () => any,
  onMouseLeave?: () => any
}) => (
  <Circle
    cx={props.graphNode.x}
    cy={props.graphNode.y}
    r={NODE_RADIUS}
    fill={Colors.offWhite}
    fillOpacity={
      props.muted ? props.node.activation * 0.1 : props.node.activation
    }
    stroke={Colors.offWhite}
    strokeOpacity={props.muted ? 0.1 : 1}
    onMouseOver={props.onMouseOver}
    onMouseLeave={props.onMouseLeave}
  />
);

const Edges = (props: {
  perceptron: PerceptronType,
  graph: Graph,
  activeNodes?: ActiveNodes,
  muted?: boolean
}) => {
  //Iterate through all the edges in perceptron
  return props.perceptron.map((layer: EdgeLayer, layerIndex) => {
    if (!layer.isNodeLayer) {
      return layer.entities.map((edge, edgeIndex) => {
        const prevLayerIndex = Math.floor(layerIndex / 2);
        const nextLayerIndex = prevLayerIndex + 1;

        const a = props.graph.getIn([prevLayerIndex, edge.backwardNode]);
        const b = props.graph.getIn([nextLayerIndex, edge.forwardNode]);

        if (a && b) {
          const active =
            props.activeNodes &&
            props.activeNodes.some(
              node =>
                (node.layer === prevLayerIndex &&
                  node.node === edge.backwardNode) ||
                (node.layer === nextLayerIndex &&
                  node.node === edge.forwardNode)
            );

          return (
            <Edge
              key={`${layerIndex}-${edgeIndex}`}
              a={a}
              b={b}
              edge={edge}
              muted={
                props.muted ||
                (props.activeNodes && props.activeNodes.length !== 0 && !active)
              }
            />
          );
        }
        return null;
      });
    }
    return null;
  });
};

const Line = styled.line`
  transition: stroke-opacity 300ms ease;
`;
const Edge = (props: {
  a: GraphNode,
  b: GraphNode,
  edge: EdgeType,
  muted?: boolean
}) => (
  <Line
    x1={props.a.x}
    y1={props.a.y}
    x2={props.b.x}
    y2={props.b.y}
    stroke={Colors.offWhite}
    strokeOpacity={props.muted ? 0.1 * props.edge.weight : props.edge.weight}
  />
);

export default Perceptron;
