import { useAppContext } from "context/app.context";
import { useCallback } from "react";

export const useTogglePlayPause = (viewId: string) => {
  const { dispatch } = useAppContext();
  return useCallback(() => {
    dispatch({ type: "TOGGLE_PLAY_PAUSE", payload: { viewId } });
  }, [dispatch]);
};
