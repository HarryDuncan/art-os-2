import { useAppContext } from "context/app.context";
import { useMemo } from "react";

const DEFAULT_EMPTY_VIEW_STATE = {
  sceneConfig: null,
  selectedSceneConfigUrl: null,
  configLength: 0,
  configIndex: -1,
  uploadedAssets: {},
  isPlaying: false,
};
export const useViewState = (viewId: string) => {
  const {
    state: { viewStates },
  } = useAppContext();

  return useMemo(() => {
    if (viewStates[viewId]) {
      return { ...DEFAULT_EMPTY_VIEW_STATE, ...viewStates[viewId] };
    }
    return DEFAULT_EMPTY_VIEW_STATE;
  }, [viewStates, viewId]);
};
