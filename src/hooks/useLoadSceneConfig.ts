import { useFetchConfig } from "art-os-package";
import { useAppContext } from "context/app.context";
import { useEffect } from "react";
import { useViewState } from "./useViewState";
import { useSelectedSceneConfig } from "./useSelectedSceneConfig";
import { useUploadedAssets } from "./useUploadedAssets";

export const useLoadSceneConfig = (viewId: string) => {
  const {
    selectedSceneConfigUrl,
    uploadedAssets,
    isPlaying,
    selectedInteractionConfigUrl,
  } = useViewState(viewId);
  const { dispatch } = useAppContext();
  const sceneConfig = useFetchConfig(selectedSceneConfigUrl);
  const interactionConfig = useFetchConfig(selectedInteractionConfigUrl);
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

  // TODO - allow for multiple selections of interaction configs
  const selectedInteractionConfig = interactionConfig
    ? interactionConfig[0]
    : null;
  const configWithUploadedAssets = useUploadedAssets(
    selectedSceneConfig,
    uploadedAssets
  );

  return {
    sceneConfig: configWithUploadedAssets,
    isPlaying,
    interactionConfig: selectedInteractionConfig,
  };
};
