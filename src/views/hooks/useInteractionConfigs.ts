import { useAppContext } from "context/app.context";
import { useMasterConfig } from "./useMasterConfig";
import { useCallback, useMemo, useState } from "react";
import { ComboboxItem } from "@mantine/core";

const MASTER_INTERACTION_CONFIG = "interaction-configs/interactions.json";
export const useInteractionConfigs = (
  viewId,
  configTagFilters: string[] = []
) => {
  const { dispatch } = useAppContext();
  const masterConfig = useMasterConfig(MASTER_INTERACTION_CONFIG);
  const [selectedSceneConfigUrl, setSelectedScene] = useState<string>("");
  const selectableConfigs = useMemo(() => {
    if (masterConfig?.length) {
      return masterConfig.flatMap(({ label, url, tags = [] }) =>
        (configTagFilters?.length &&
          configTagFilters.some((tag) => tags.includes(tag))) ||
        !configTagFilters?.length ||
        !configTagFilters
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
          viewStateData: { selectedInteractionConfigUrl: option.value },
        },
      });
    },
    [masterConfig, setSelectedScene, dispatch]
  );
  return { selectableConfigs, onSelect, selectedSceneConfigUrl };
};
