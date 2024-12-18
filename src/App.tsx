import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SceneNode,
  useAssets,
  useFetchConfig,
  useSceneData,
  WindowStateProvider,
  dispatchInteractionEvent,
} from "art-os-package";
import { ipcRenderer, onMessage } from "ipc";
import { InteractiveScene } from "art-os-package/src/components/interactive-scene/InteractiveScene";
import { getSceneElementByName } from "art-os-package/src/utils/scene/getSceneElementByName";
import * as THREE from "three";

async function getMediaDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const webcams = devices.filter((device) => device.kind === "videoinput"); // Filter only webcams
  return webcams;
}

const SCENE_CONFIG_URL = "scene-configs/id-scene-2.json";
const App = () => {
  const sceneConfig = useFetchConfig(SCENE_CONFIG_URL);
  return (
    <WindowStateProvider>
      {sceneConfig && <AppContent sceneConfig={sceneConfig} />}
    </WindowStateProvider>
  );
};

const AppContent = ({ sceneConfig }) => {
  const [streamData, setStreamData] = useState(null);
  const canvasRef = useRef(null); // Reference to the canvas element

  const { areAssetsInitialized, initializedAssets } = useAssets(
    sceneConfig[0].assets
  );
  const sceneData = useSceneData(
    sceneConfig[0],
    initializedAssets,
    areAssetsInitialized
  );

  useEffect(() => {
    // Listen for the "bodypix-streaming" event
    onMessage("new-measurement", (measurementResult) => {
      // Create ImageData from streamData
      const { data, width, height } = measurementResult[0];
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      );
      // console.log(data);
      // console.log(width);
      // console.log(measurementResult);
      // const texture = new THREE.Texture(
      //   imageData, // Raw data
      //   width, // Texture width
      //   height, // Texture height
      //   THREE.RGBAFormat, // Format of the data
      //   THREE.UnsignedByteType // Type of data
      // );
      // texture.needsUpdate = true;
      // const imageData = new ImageData(
      //   new Uint8ClampedArray(data),
      //   width,
      //   height
      // );

      // Step 2: Draw ImageData onto Canvas
      // const canvas = document.createElement("canvas");
      // canvas.width = width;
      // canvas.height = height;
      // const ctx = canvas.getContext("2d");
      // ctx.putImageData(imageData, 0, 0);

      // // Step 3: Convert Canvas to Texture
      // const texture = new THREE.CanvasTexture(canvas);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(imageData, 0, 0);

      // Step 3: Convert Canvas to Image
      const img = new Image();
      img.onload = () => {
        // Pass the image as a texture
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;

        // Dispatch interaction event with the texture
        dispatchInteractionEvent("update", texture);
      };
      img.src = canvas.toDataURL();
      // Pass the texture as a uniform to the shader
      // dispatchInteractionEvent("update", texture);
      // dispatchInteractionEvent("update", texture);
    });
  }, [streamData]);

  const startBodyPix = async () => {
    try {
      const webcams = await getMediaDevices();
      if (webcams.length === 0) {
        console.error("No webcams found!");
        return;
      }
      ipcRenderer.invoke("start-bodypix");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const stopBodyPix = useCallback(async () => {
    try {
      const result = await ipcRenderer.invoke("stop-bodypix");
      if (result.success) {
        console.log("BodyPix stopped successfully");
        setStreamData(null); // Clear streaming data
      } else {
        console.error("Failed to stop BodyPix:", result.error);
      }
    } catch (error) {
      console.error("Error stopping BodyPix:", error);
    }
  }, []);
  useEffect(() => {
    if (!streamData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Create ImageData from streamData
    const { data, width, height } = streamData;
    canvas.width = width;
    canvas.height = height;
    console.log(data);
    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);

    // Clear and draw the updated frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(imageData, 0, 0);
  }, [streamData]);

  const TARGET_IDENTIFIER = "";
  const passBodyPixDataToUniform = useCallback(
    (scene: InteractiveScene, bodypixData) => {
      const animatedObjects = getSceneElementByName(scene, TARGET_IDENTIFIER);
      console.log(bodypixData);
      console.log(animatedObjects[0].material.uniforms.uTexture.value);
      animatedObjects[0].material.uniforms.uTexture.value = bodypixData;
    },
    []
  );

  const interactionEvent = useMemo(
    () => ({
      eventKey: "update",
      onEvent: passBodyPixDataToUniform,
    }),
    [passBodyPixDataToUniform]
  );

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={startBodyPix}>Run BodyPix Algorithm</button>
      <button onClick={stopBodyPix}>Stop Bodypix</button>
      {sceneData && areAssetsInitialized && (
        <SceneNode
          sceneData={sceneData}
          events={[]}
          interactionEvents={[interactionEvent]}
        />
      )}
    </div>
  );
};

export default App;
