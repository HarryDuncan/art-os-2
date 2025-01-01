import { BodyPix } from "@tensorflow-models/body-pix";
import {
  useAssets,
  useSceneData,
  dispatchInteractionEvent,
  useFetchConfig,
  SceneNode,
} from "art-os-package";
import { InteractiveScene } from "art-os-package/src/components/interactive-scene/InteractiveScene";
import { getSceneElementByName } from "art-os-package/src/utils/scene/getSceneElementByName";
import { onMessage, ipcRenderer } from "ipc";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

async function getMediaDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const webcams = devices.filter((device) => device.kind === "videoinput"); // Filter only webcams
  return webcams;
}

export const InteractiveView = ({ sceneConfig }) => {
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
      // log here
      const { data, width, height } = measurementResult[0];
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      );
      // log here
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
        // log here
        // Dispatch interaction event with the texture
        dispatchInteractionEvent("update", texture);
      };
      img.src = canvas.toDataURL();
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

  const TARGET_IDENTIFIER = "";
  const passBodyPixDataToUniform = useCallback(
    (scene: InteractiveScene, bodypixData) => {
      const animatedObjects = getSceneElementByName(scene, TARGET_IDENTIFIER);

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
