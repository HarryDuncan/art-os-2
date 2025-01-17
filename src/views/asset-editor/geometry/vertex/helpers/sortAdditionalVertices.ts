import { AdditionalVertexPosition } from "../../editGeometry.types";

export const sortAdditionalVertices = (
  additional: AdditionalVertexPosition[]
) => additional.sort((a, b) => a.insertPosition - b.insertPosition);
