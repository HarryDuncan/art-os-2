import { ComboboxItem } from "@mantine/core";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { Dropdown } from "components/inputs/Dropdown";
import { SpinButton } from "components/inputs/Spin";
import { useAppContext } from "context/app.context";
import { useViewState } from "hooks/useViewState";
import { useCallback, useMemo } from "react";

interface SceneIndexController {
  viewId: string;
}
export const SceneIndexController = ({ viewId }: SceneIndexController) => {
  const { dispatch } = useAppContext();
  const { configIndex, sceneConfig } = useViewState(viewId);
  const handleChange = useCallback(
    (_value: string | null, option: ComboboxItem) => {
      dispatch({
        type: "UPDATE_VIEW_STATE",
        payload: {
          viewId,
          viewStateData: {
            configIndex: Number(option.value),
            isPlaying: false,
          },
        },
      });
    },
    [dispatch]
  );

  const scenes = useSceneTitleAndDescription(configIndex, sceneConfig);

  if (configIndex === -1 || !sceneConfig) {
    return null;
  }
  return (
    <TopBarItem>
      <Dropdown
        key={"scene-configs"}
        data={scenes}
        onChange={handleChange}
        label={"Select A Scene"}
      />
    </TopBarItem>
  );
};

const useSceneTitleAndDescription = (
  configIndex: number,
  sceneConfig: SceneConfig[] | null | undefined
) =>
  useMemo(() => {
    if (configIndex === -1 || !sceneConfig) {
      return [];
    }
    return sceneConfig.map(({ title }, index) => ({
      label: title ?? `Scene ${index + 1}`,
      value: String(index),
    }));
  }, [configIndex, sceneConfig]);
