import { useAppContext } from "context/app.context";
import { useCallback } from "react";

export const useSetUploadedAssets = (viewId) => {
  const { dispatch } = useAppContext();
  return useCallback(
    (assetId: string, path: string) => {
      dispatch({
        type: "UPDATE_UPLOADED_ASSETS",
        payload: { viewId, assetId, path },
      });
    },
    [dispatch]
  );
};
