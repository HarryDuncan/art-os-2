import { useFetchConfig } from "art-os-package";
import { useAppContext } from "context/app.context";
import { useEffect } from "react";
import { useViewState } from "./useViewState";

export const useLoadSceneConfig = (viewId: string) => {
  const { selectedSceneConfigUrl } = useViewState(viewId);
  const { dispatch } = useAppContext();
  const sceneConfig = useFetchConfig(selectedSceneConfigUrl);

  useEffect(() => {
    if (sceneConfig) {
      const configLength = sceneConfig.length + 1;
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
};
