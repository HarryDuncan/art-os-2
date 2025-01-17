import {
  SceneNode,
  useAssets,
  useFetchConfig,
  useSceneData,
} from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { useAppContext } from "context/app.context";
import { useSceneConfigs } from "./hooks/useSceneConfigs";
import { Dropdown } from "components/inputs/Dropdown";
import { SCENE_TAGS } from "consts/sceneConfig.consts";

interface VideoFilterProps {
  sceneConfig: SceneConfig[];
}

const TAG_FILTERS = [SCENE_TAGS.VIDEO_FILTER];
export const VideoFilter = () => {
  const {
    state: { isViewFullScreen },
  } = useAppContext();
  const { onSelect, selectableConfigs, selectedSceneConfigUrl } =
    useSceneConfigs(TAG_FILTERS);

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

      {sceneConfig && <VideoFilterContent sceneConfig={sceneConfig} />}
    </div>
  );
};

const VideoFilterContent = ({ sceneConfig }: VideoFilterProps) => {
  // const [streamData, setStreamData] = useState(null);
  // const canvasRef = useRef(null); // Reference to the canvas element

  const { areAssetsInitialized, initializedAssets } = useAssets(
    sceneConfig[0].assets
  );
  const sceneData = useSceneData(
    sceneConfig[0],
    initializedAssets,
    areAssetsInitialized
  );

  return (
    <div>
      {sceneData && areAssetsInitialized && (
        <SceneNode sceneData={sceneData} events={[]} interactionEvents={[]} />
      )}
      <div id="append-container" />
    </div>
  );
};
