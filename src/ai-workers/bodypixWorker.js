const { parentPort } = require("worker_threads");
const tf = require("@tensorflow/tfjs-node-gpu");
const CameraCapture = require("camera-capture");
const bodySegmentation = require("@tensorflow-models/body-segmentation");

const capture = new CameraCapture.VideoCapture({
  device: 0,
  width: 640,
  height: 480,
  fps: 5,
});

async function setupBackend() {
  const availableBackends = await tf.backend();
  console.log(availableBackends);
  // const devices = await tf.config.listPhysicalDevices("GPU");
  // if (devices.length > 0) {
  //   console.log(`Number of GPUs detected: ${devices.length}`);
  //   devices.forEach((device, index) => {
  //     console.log(`GPU ${index}: ${device.name}`);
  //   });
  // } else {
  //   console.log("No GPU detected.");
  // }
  // await tf.setBackend("webgl"); // Explicitly set to TensorFlow.js backend
  // const backend = tf.getBackend();
  // console.log(`Using backend: ${backend}`);
}
setupBackend();

parentPort.on("message", async (msg) => {
  if (msg === "init") {
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: "tfjs", // or 'tfjs'
      modelType: "general",
    };
    const segmenter = await bodySegmentation.createSegmenter(
      model,
      segmenterConfig
    );

    capture.addFrameListener(async (frame) => {
      try {
        const startTime = Date.now(); // Start timing

        // log here 1
        console.log(
          `[Log 1] Start segmentation process: ${new Date().toISOString()}`
        );
        const segmentation = await segmenter.segmentPeople(frame);
        const afterSegmentation = Date.now();
        console.log(
          `[Log 1] Time taken for segmentation: ${
            afterSegmentation - startTime
          }ms`
        );

        if (Array.isArray(segmentation)) {
          const serializedSegmentation = segmentation.map((segment) => {
            const tensorData = segment.mask.mask; // TensorFlow.js Tensor

            // Create binary mask
            const binaryMask = tensorData.greater(0.5).toInt();

            // Expand dimensions and create RGBA
            const maskExpanded = binaryMask.expandDims(-1);
            const rgbChannels = maskExpanded.mul(255);
            const alphaChannel = tf
              .onesLike(binaryMask)
              .expandDims(-1)
              .mul(255);

            const rgbaTensor = tf.concat(
              [rgbChannels, rgbChannels, rgbChannels, alphaChannel],
              -1
            );

            // Convert to Uint8ClampedArray
            const rgbaData = new Uint8ClampedArray(rgbaTensor.dataSync());
            const [height, width] = segment.mask.mask.shape;

            return {
              width,
              height,
              data: rgbaData,
            };
          });

          parentPort.postMessage({
            type: "new-measurement",
            result: serializedSegmentation,
          });

          const endTime = Date.now();
          console.log(
            `[Log 4] Total time for frame processing: ${endTime - startTime}ms`
          );

          parentPort.postMessage({
            type: "new-measurement",
            result: serializedSegmentation,
          });
        } else {
          console.warn("Unexpected segmentation result:", segmentation);
          parentPort.postMessage({
            type: "error",
            error: "Segmentation result is not an array.",
          });
        }
      } catch (error) {
        parentPort.postMessage({
          type: "error",
          error: error.message,
        });
      }
    });
    await capture.start();
  }

  if (msg === "terminate") {
    const stopResult = await capture.stop();
    return stopResult;
  }
});

// const cpuTensor = () => {
//   const startTime = Date.now(); // Start timing

//   // log here 1
//   console.log(
//     `[Log 1] Start segmentation process: ${new Date().toISOString()}`
//   );
//   const segmentation = await segmenter.segmentPeople(frame);
//   const afterSegmentation = Date.now();
//   console.log(
//     `[Log 1] Time taken for segmentation: ${
//       afterSegmentation - startTime
//     }ms`
//   );

//   if (Array.isArray(segmentation)) {
//     const serializedSegmentation = segmentation.map((segment) => {
//       const mapStartTime = Date.now(); // Start timing map process

//       // log here 2
//       console.log(
//         `[Log 2] Start processing a segment: ${new Date().toISOString()}`
//       );
//       const tensorData = segment.mask.mask.dataSync();
//       const [height, width] = segment.mask.mask.shape;

//       const rgbaData = new Uint8ClampedArray(width * height * 4);
//       const beforeRgbaLoop = Date.now();
//       console.log(
//         `[Log 2] Time taken for tensorData extraction: ${
//           beforeRgbaLoop - mapStartTime
//         }ms`
//       );

//       // log here 3
//       console.log(`[Log 3] Start RGBA loop: ${new Date().toISOString()}`);
//       for (let i = 0; i < tensorData.length; i++) {
//         const value = tensorData[i] > 0.5 ? 255 : 0; // Threshold to binary mask
//         const pixelIndex = i * 4; // RGBA channels
//         rgbaData[pixelIndex] = value; // Red
//         rgbaData[pixelIndex + 1] = value; // Green
//         rgbaData[pixelIndex + 2] = value; // Blue
//         rgbaData[pixelIndex + 3] = 255; // Alpha (fully opaque)
//       }
//       const afterRgbaLoop = Date.now();
//       console.log(
//         `[Log 3] Time taken for RGBA loop: ${
//           afterRgbaLoop - beforeRgbaLoop
//         }ms`
//       );

//       // log here 4
//       console.log(
//         `[Log 4] Finished processing a segment: ${new Date().toISOString()}`
//       );
//       return {
//         width,
//         height,
//         data: rgbaData,
//       };
//     });

//     const endTime = Date.now();
//     console.log(
//       `[Log 4] Total time for frame processing: ${endTime - startTime}ms`
//     );

//     parentPort.postMessage({
//       type: "new-measurement",
//       result: serializedSegmentation,
//     });
// }
