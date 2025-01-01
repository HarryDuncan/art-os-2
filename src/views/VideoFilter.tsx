import { SceneNode, useAssets, useSceneData } from "art-os-package";
import { SceneConfig } from "art-os-package/src/config/config.types";

interface VideoFilterProps {
  sceneConfig: SceneConfig[];
}
export const VideoFilter = ({ sceneConfig }: VideoFilterProps) => {
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
