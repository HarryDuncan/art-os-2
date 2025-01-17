import { useFetchConfig } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { Dropdown } from "components/inputs/Dropdown";
import { VIEW_TYPES } from "consts/views.consts";
import { useAppContext } from "context/app.context";
import { useSceneConfigs } from "views/hooks/useSceneConfigs";
import { InteractiveView } from "views/interactive";
import { P5Container } from "views/P5Container";

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
    case VIEW_TYPES.P5:
      return <P5Container />;
    default:
      return null;
  }
};
