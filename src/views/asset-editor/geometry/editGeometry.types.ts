import { Axis } from "art-os-package/src/utils/three-dimension-space/position/position.types";

export interface VertexAdditionConfig {
  vertexPositionsCount: number;
  vertexPositionAxis: Axis;
}

export interface AdditionalVertexPosition {
  vertices: number[];
  insertPosition: number;
}
