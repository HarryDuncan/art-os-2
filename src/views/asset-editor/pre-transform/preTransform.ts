import { Asset } from "art-os-package/src/assets/asset.types";
import { getAssetBufferGeometry } from "art-os-package/src/config/mesh/geometry/getAssetGeometries";
import { translateToOrigin } from "./translateToOrigin";

interface PreTransformConfig {
  centerGeometry?: boolean;
}
export const preTransformGeometry = (
  assets: Asset[],
  preTransformConfig: PreTransformConfig
) =>
  assets.map((asset) => {
    const geometry = getAssetBufferGeometry(asset);
    const { centerGeometry } = preTransformConfig;
    if (geometry) {
      if (centerGeometry) {
        translateToOrigin(geometry);
      }
    }
    return asset;
  });
