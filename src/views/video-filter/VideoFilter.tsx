import { SceneNode, useAssets, useSceneData } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";
import { VideoFilterToolBar } from "./VideoFilterToolBar";
import { VIEW_TYPES } from "consts/views.consts";

import { useLoadSceneConfig } from "hooks/useLoadSceneConfig";

export const VideoFilter = () => {
  const { sceneConfig, isPlaying } = useLoadSceneConfig(
    VIEW_TYPES.VIDEO_FILTER
  );
  console.log(sceneConfig);

  return (
    <div className="view-container">
      <VideoFilterToolBar />
      {sceneConfig && isPlaying && (
        <VideoFilterContent sceneConfig={sceneConfig} />
      )}
    </div>
  );
};

interface VideoFilterProps {
  sceneConfig: SceneConfig;
}

const VideoFilterContent = ({ sceneConfig }: VideoFilterProps) => {
  const { areAssetsInitialized, initializedAssets } = useAssets(
    sceneConfig.assets
  );

  console.log(sceneConfig);
  const sceneData = useSceneData(
    sceneConfig,
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
