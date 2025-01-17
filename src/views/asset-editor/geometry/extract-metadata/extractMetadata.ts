import { Asset } from "art-os-package/src/assets/asset.types";
import { getGeometryBoundingBox } from "../buffer-geometry/getGeometryBoundingBox";
import { getAssetBufferGeometry } from "art-os-package/src/config/mesh/geometry/getAssetGeometries";
import { getPositionsLength } from "art-os-package/src/config/mesh/attributes/attribute.functions";

export const extractMetadata = (assets: Asset[]): Asset[] =>
  assets.flatMap((asset) => {
    const bufferGeometry = getAssetBufferGeometry(asset);
    if (!bufferGeometry) return [];
    const boundingBox = getGeometryBoundingBox(bufferGeometry);
    const vertexCount = getPositionsLength(bufferGeometry);
    const assetData = {
      ...asset,
      metaData: {
        boundingBox,
        vertexCount,
      },
    };
    delete assetData.data;
    return assetData;
  });
