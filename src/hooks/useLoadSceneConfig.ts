import { useFetchConfig } from "art-os-package";
import { useAppContext } from "context/app.context";
import { useEffect } from "react";
import { useViewState } from "./useViewState";
import { useSelectedSceneConfig } from "./useSelectedSceneConfig";
import { useUploadedAssets } from "./useUploadedAssets";

export const useLoadSceneConfig = (viewId: string) => {
  const { selectedSceneConfigUrl, uploadedAssets, isPlaying } =
    useViewState(viewId);
  const { dispatch } = useAppContext();
  const sceneConfig = useFetchConfig(selectedSceneConfigUrl);

  useEffect(() => {
    if (sceneConfig) {
      const configLength = sceneConfig.length;
      const configIndex = 0;
      dispatch({
        type: "UPDATE_VIEW_STATE",
        payload: {
          viewId,
          viewStateData: { sceneConfig, configLength, configIndex },
        },
      });
    }
  }, [dispatch, sceneConfig]);
  const selectedSceneConfig = useSelectedSceneConfig(viewId);

  const configWithUploadedAssets = useUploadedAssets(
    selectedSceneConfig,
    uploadedAssets
  );
  console.log(uploadedAssets);
  console.log(configWithUploadedAssets);
  return { sceneConfig: configWithUploadedAssets, isPlaying };
};
