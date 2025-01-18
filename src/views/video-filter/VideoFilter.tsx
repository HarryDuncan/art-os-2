import { SceneNode, useAssets, useSceneData } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { VideoFilterToolBar } from "./VideoFilterToolBar";
import { VIEW_TYPES } from "consts/views.consts";
import { useViewState } from "hooks/useViewState";
import { useLoadSceneConfig } from "hooks/useLoadSceneConfig";

interface VideoFilterProps {
  sceneConfig: SceneConfig[];
}

export const VideoFilter = () => {
  useLoadSceneConfig(VIEW_TYPES.VIDEO_FILTER);
  const { sceneConfig } = useViewState(VIEW_TYPES.VIDEO_FILTER);

  return (
    <div className="view-container">
      <VideoFilterToolBar />
      {sceneConfig && <VideoFilterContent sceneConfig={sceneConfig} />}
    </div>
  );
};

const VideoFilterContent = ({ sceneConfig }: VideoFilterProps) => {
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
