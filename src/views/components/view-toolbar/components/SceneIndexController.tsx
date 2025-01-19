import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { SpinButton } from "components/inputs/Spin";
import { useAppContext } from "context/app.context";
import { useViewState } from "hooks/useViewState";
import { useCallback } from "react";

interface SceneIndexController {
  viewId: string;
}
export const SceneIndexController = ({ viewId }: SceneIndexController) => {
  const { dispatch } = useAppContext();
  const { configIndex, configLength } = useViewState(viewId);
  const handleChange = useCallback(
    (value) => {
      dispatch({
        type: "UPDATE_VIEW_STATE",
        payload: {
          viewId,
          viewStateData: { configIndex: value, isPlaying: false },
        },
      });
    },
    [dispatch]
  );

  if (configIndex === -1) {
    return null;
  }
  return (
    <TopBarItem>
      <SpinButton
        value={configIndex}
        min={0}
        max={configLength - 1}
        onChange={handleChange}
      />
    </TopBarItem>
  );
};
