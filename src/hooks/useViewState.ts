import { useAppContext } from "context/app.context";
import { useMemo } from "react";

export const useViewState = (viewId: string) => {
  const {
    state: { viewStates },
  } = useAppContext();

  const viewState = useMemo(() => viewStates[viewId], [viewStates]);

  if (viewState) {
    return viewState;
  } else {
    return { sceneConfig: null, selectedSceneConfigUrl: null };
  }
};
