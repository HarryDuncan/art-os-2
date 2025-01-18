import { useMemo } from "react";
import { useViewState } from "./useViewState";

export const useSelectedSceneConfig = (viewId) => {
  const { sceneConfig, configIndex } = useViewState(viewId);

  return useMemo(() => {
    if (configIndex !== undefined && configIndex !== -1 && sceneConfig) {
      return sceneConfig[configIndex];
    }
    return null;
  }, [configIndex, sceneConfig]);
};
