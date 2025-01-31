import { useAppContext } from "context/app.context";
import { useCallback } from "react";
import { useViewState } from "./useViewState";

export const useTogglePlayPause = (viewId: string) => {
  const { dispatch } = useAppContext();
  const { isPlaying } = useViewState(viewId);
  const toggleCallback = useCallback(() => {
    dispatch({ type: "TOGGLE_PLAY_PAUSE", payload: { viewId } });
  }, [dispatch]);
  return { toggleCallback, isPlaying };
};
