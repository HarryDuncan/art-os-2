import { SceneConfig } from "art-os-package/src/config/config.types";
import { UploadedAsset } from "context/app.types";
import { useMemo } from "react";

const PROJECT_ROOT = `C:\\Users\\harry\\Projects\\art-os-2\\public\\`;
export const useUploadedAssets = (
  sceneConfig: SceneConfig | null | undefined,
  uploadedAssets: UploadedAsset
) =>
  useMemo(() => {
    if (!sceneConfig) {
      return null;
    }

    const assets = sceneConfig.assets?.map((asset) => {
      if (uploadedAssets) {
        const selectedAsset = uploadedAssets[asset.id];
        if (selectedAsset) {
          if (selectedAsset.indexOf(PROJECT_ROOT) === -1) {
            console.error(
              `Uploaded asset ${asset.id} is not in project public folder so can't be used`
            );
          } else {
            return {
              ...asset,
              url: selectedAsset.replace(PROJECT_ROOT, ""),
            };
          }
        }
      }
      return asset;
    });
    return { ...sceneConfig, assets };
  }, [sceneConfig, uploadedAssets]);
