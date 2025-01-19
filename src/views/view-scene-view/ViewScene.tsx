import { SceneNode, useAssets, useSceneData } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";

import { VIEW_TYPES } from "consts/views.consts";

import { useLoadSceneConfig } from "hooks/useLoadSceneConfig";
import { ViewSceneToolBar } from "./ViewSceneToolBar";

export const ViewScene = () => {
  const { sceneConfig, isPlaying } = useLoadSceneConfig(VIEW_TYPES.VIEW_SCENE);
  console.log(sceneConfig);

  return (
    <div className="view-container">
      <ViewSceneToolBar />
      {sceneConfig && isPlaying && (
        <ViewSceneContent sceneConfig={sceneConfig} />
      )}
    </div>
  );
};

interface ViewSceneProps {
  sceneConfig: SceneConfig;
}

const ViewSceneContent = ({ sceneConfig }: ViewSceneProps) => {
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
