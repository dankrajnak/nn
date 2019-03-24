// @flow
import type { List } from "immutable";
export type Node = {|
  +activation: number,
  +bias: number
|};

export type Edge = {|
  +weight: number,
  +forwardNode: number,
  +backwardNode: number
|};

// These are to help with flow typing.  It may not be a good idea
// to change code structure just to make type-checking easier,
// but type checking will make developing easier, so, judge me.
export type NodeLayer = {| isNodeLayer: boolean, entities: List<Node> |};
export type EdgeLayer = {| isNodeLayer: boolean, entities: List<Edge> |};

export type Layer = {| isNodeLayer: boolean, entities: List<any> |};

/**
 * A perceptron is an alternating list of NodeLayers and EdgeLayers.
 * Every even layer, including 0, is a NodeLayer, every odd layer is an EdgeLayer.
 *
 * Additionally, node layers and edge layers have flags which identify their type
 * so that it's easier to enforce this constraint and check the validity of a perceptron.
 */
export type Perceptron = List<Layer>;
