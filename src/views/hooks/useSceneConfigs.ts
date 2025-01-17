import { useCallback, useMemo, useState } from "react";
import { useMasterConfig } from "./useMasterConfig";
import { ComboboxItem } from "@mantine/core";

const MASTER_CONFIG = "scene-configs/scenes.json";

export const useSceneConfigs = (tagFilters?: string[]) => {
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
    },
    [masterConfig, setSelectedScene]
  );
  return { selectableConfigs, onSelect, selectedSceneConfigUrl };
};
