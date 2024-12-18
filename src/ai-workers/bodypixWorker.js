const { parentPort } = require("worker_threads");
const tf = require("@tensorflow/tfjs-node");
const CameraCapture = require("camera-capture");
const bodySegmentation = require("@tensorflow-models/body-segmentation");
const { createCanvas, ImageData } = require("canvas");
tf.setBackend("cpu");
const capture = new CameraCapture.VideoCapture({
  device: 0,
  width: 640,
  height: 480,
  fps: 5,
});

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
        const segmentation = await segmenter.segmentPeople(frame);

        if (Array.isArray(segmentation)) {
          const serializedSegmentation = segmentation.map((segment) => {
            const tensorData = segment.mask.mask.dataSync();
            // const binaryMask = tensorData.greater(0.5).toInt();
            const [height, width] = segment.mask.mask.shape;
            const rgbaData = new Uint8ClampedArray(width * height * 4);
            // const rgbaTensor = binaryMask
            //   .mul(255)
            //   .expandDims(-1)
            //   .concat(tf.onesLike(binaryMask).mul(255), -1); // Add RGBA channels
            // const rgbaData = new Uint8ClampedArray(rgbaTensor.dataSync());
            for (let i = 0; i < tensorData.length; i++) {
              // Apply thresholding to create binary mask

              const value = tensorData[i] > 0.5 ? 255 : 0; // Threshold to binary mask
              const pixelIndex = i * 4; // RGBA channels
              rgbaData[pixelIndex] = value; // Red
              rgbaData[pixelIndex + 1] = value; // Green
              rgbaData[pixelIndex + 2] = value; // Blue
              rgbaData[pixelIndex + 3] = 255; // Alpha (fully opaque)
            }
            return {
              width, // Include dimensions
              height,
              data: rgbaData, // Convert Tensor data to an array
            };
          });

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

//  // const tensorData = segment.mask.mask.dataSync(); // Extract raw data from Tensor
//       const tensorData = segment.mask.mask;
//       // const binaryMask = tensorData.greater(0.5).toInt();
//       const [height, width] = segment.mask.mask.shape;
//       // // const rgbaData = new Uint8ClampedArray(width * height * 4);
//       // const rgbaTensor = binaryMask
//       //   .mul(255)
//       //   .expandDims(-1)
//       //   .concat(tf.onesLike(binaryMask).mul(255), -1); // Add RGBA channels
//       // const rgbaData = new Uint8ClampedArray(rgbaTensor.dataSync());
//       // // for (let i = 0; i < tensorData.length; i++) {
//       // //   // Apply thresholding to create binary mask

//       // //   const value = tensorData[i] > 0.5 ? 255 : 0; // Threshold to binary mask
//       // //   const pixelIndex = i * 4; // RGBA channels
//       // //   rgbaData[pixelIndex] = value; // Red
//       // //   rgbaData[pixelIndex + 1] = value; // Green
//       // //   rgbaData[pixelIndex + 2] = value; // Blue
//       // //   rgbaData[pixelIndex + 3] = 255; // Alpha (fully opaque)
//       // // }
//       const tensorData = segment.mask.mask; // TensorFlow.js Tensor

//       // Create binary mask: Shape [height, width]
//       const binaryMask = tensorData.greater(0.5).toInt(); // Threshold to binary mask

//       // Expand dimensions to create [height, width, 1]
//       const maskExpanded = binaryMask.expandDims(-1); // Add channel dimension

//       // Create RGB channels: [height, width, 1]
//       const rgbChannels = maskExpanded.mul(255); // Scale binary mask to 255

//       // Create Alpha channel: [height, width, 1] (fully opaque)
//       const alphaChannel = tf
//         .onesLike(binaryMask)
//         .expandDims(-1)
//         .mul(255);

//       // Concatenate RGB and Alpha channels along the last axis (axis = -1)
//       const rgbaTensor = tf.concat(
//         [rgbChannels, rgbChannels, rgbChannels, alphaChannel],
//         -1
//       );

//       // Convert to Uint8ClampedArray
//       const rgbaData = new Uint8ClampedArray(rgbaTensor.dataSync()); //
//       const canvas = createCanvas(256, 256); // Specify desired dimensions
//       const ctx = canvas.getContext("2d");
//       const imgData = new ImageData(rgbaData, width, height);

//       // // Scale the image onto the canvas
//       // const tempCanvas = createCanvas(width, height);
//       // const tempCtx = tempCanvas.getContext("2d");
//       // tempCtx.putImageData(imgData, 0, 0);
//       // ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, 256, 256);

//       // Extract resized image data
//       //   const resizedImgData = ctx.getImageData(0, 0, 256, 256);
