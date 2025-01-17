import { ComboboxItem } from "@mantine/core";
import { useFetchConfig } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { Dropdown } from "components/inputs/Dropdown";
import { VIEW_TYPES } from "consts/views.consts";
import { useAppContext } from "context/app.context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InteractiveView } from "views/interactive";
import { P5Container } from "views/P5Container";
import { VideoFilter } from "views/VideoFilter";

interface ViewWrapperProps {
  sceneType: string;
}

export const ViewWrapper = ({ sceneType }: ViewWrapperProps) => {
  const {
    state: { isViewFullScreen },
  } = useAppContext();
  const { onSelect, selectableConfigs, selectedSceneConfigUrl } =
    useSceneConfigs();

  const sceneConfig = useFetchConfig(selectedSceneConfigUrl);
  return (
    <div className="view-container">
      {!isViewFullScreen && (
        <Dropdown
          key={""}
          data={selectableConfigs}
          onChange={onSelect}
          label={"Select A Scene"}
        />
      )}

      {sceneConfig && (
        <ViewChild sceneType={sceneType} sceneConfig={sceneConfig} />
      )}
    </div>
  );
};

interface ViewChildProps {
  sceneType: string;
  sceneConfig: SceneConfig[];
}
const ViewChild = ({ sceneType, sceneConfig }: ViewChildProps) => {
  switch (sceneType) {
    case VIEW_TYPES.INTERACTIVE:
      return <InteractiveView sceneConfig={sceneConfig} />;
    case VIEW_TYPES.VIDEO_FILTER:
      return <VideoFilter sceneConfig={sceneConfig} />;
    case VIEW_TYPES.P5:
      return <P5Container />;
    default:
      return null;
  }
};

const MASTER_CONFIG = "scene-configs/scenes.json";

const useSceneConfigs = () => {
  const masterConfig = useMasterConfig(MASTER_CONFIG);
  const [selectedSceneConfigUrl, setSelectedScene] = useState<string>("");
  const selectableConfigs = useMemo(() => {
    if (masterConfig?.length) {
      return masterConfig.map(({ label, url }) => ({ label, value: url }));
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

const useMasterConfig = (filePath: string) => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!data && filePath.length) {
        try {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error("Failed to fetch JSON file");
          }
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [filePath, data]);
  return data;
};
