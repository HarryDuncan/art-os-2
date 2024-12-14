import cv2
import tensorflow as tf
from tf_bodypix.api import download_model, load_model, BodyPixModelPaths
from .detection_algorithm import DetectionAlgorithm


class BodyPix(DetectionAlgorithm):
     def __init__(self):
        super().__init__()
        self.cluster_buffer_data = []
        self.window_size = 3
        self.algorithm_config = None
        self.cap = None
        self.model = None
    
     def set_config(self, algorithm_config):
        self.algorithm_config = algorithm_config

     def run_algorithm(self):
        bodypix_model = load_model(download_model(BodyPixModelPaths.MOBILENET_FLOAT_50_STRIDE_16))
        self.isRunning = True
        self.cap = cv2.VideoCapture(0)
        desired_fps = 10  # Set desired frame rate
        self.cap.set(cv2.CAP_PROP_FPS, desired_fps)

        # Reduce the resolution
        desired_width = 320  # Lower resolution width
        desired_height = 240  # Lower resolution height
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)
        while self.cap.isOpened() and self.isRunning:
            ret, frame = self.cap.read()  # Corrected here
            # BodyPix Detections
            result = bodypix_model.predict_single(frame)
            mask = result.get_mask(threshold=0.5).numpy().astype(np.uint8)
            masked_image = cv2.bitwise_and(frame, frame, mask=mask)
            
            # Show result to user on desktop
            cv2.imshow('BodyPix', masked_image)
            
            # Break loop outcome 
            if cv2.waitKey(10) & 0xFF == ord('q'):
                break


        self.cap.release()