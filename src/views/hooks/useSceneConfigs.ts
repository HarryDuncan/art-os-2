import { useCallback, useMemo, useState } from "react";
import { useMasterConfig } from "./useMasterConfig";
import { ComboboxItem } from "@mantine/core";
import { useAppContext } from "context/app.context";

const MASTER_CONFIG = "scene-configs/scenes.json";

export const useSceneConfigs = (viewId, tagFilters?: string[]) => {
  const { dispatch } = useAppContext();
  const masterConfig = useMasterConfig(MASTER_CONFIG);
  const [selectedSceneConfigUrl, setSelectedScene] = useState<string>("");
  const selectableConfigs = useMemo(() => {
    if (masterConfig?.length) {
      return masterConfig.flatMap(({ label, url, tags = [] }) =>
        (tagFilters?.length && tagFilters.some((tag) => tags.includes(tag))) ||
        !tagFilters?.length ||
        !tagFilters
          ? { label, value: url }
          : []
      );
    }
    return [];
  }, [masterConfig]);

  const onSelect = useCallback(
    (_value: string | null, option: ComboboxItem) => {
      setSelectedScene(option.value);
      dispatch({
        type: "UPDATE_VIEW_STATE",
        payload: {
          viewId,
          viewStateData: { selectedSceneConfigUrl: option.value },
        },
      });
    },
    [masterConfig, setSelectedScene, dispatch]
  );
  return { selectableConfigs, onSelect, selectedSceneConfigUrl };
};
