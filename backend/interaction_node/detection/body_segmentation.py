import cv2
import tensorflow as tf
import numpy as np
import cv2
import tensorflow as tf
from tf_bodypix.api import download_model, load_model, BodyPixModelPaths

# Initialize webcam cap
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

desired_fps = 10  # Set desired frame rate
cap.set(cv2.CAP_PROP_FPS, desired_fps)

# Reduce the resolution
desired_width = 320  # Lower resolution width
desired_height = 240  # Lower resolution height
cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)
bodypix_model = load_model(download_model(BodyPixModelPaths.MOBILENET_FLOAT_50_STRIDE_16))
# Loop to cap frames and process them
while True:
    
    isRunning = True
   
    while cap.isOpened() and isRunning:
        ret, frame = cap.read()  # Corrected here
        # BodyPix Detections
        result = bodypix_model.predict_single(frame)
        mask = result.get_mask(threshold=0.5).numpy().astype(np.uint8)
        masked_image = cv2.bitwise_and(frame, frame, mask=mask)
        
        # Show result to user on desktop
        cv2.imshow('BodyPix', masked_image)
        
        # Break loop outcome 
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break


    cap.release()


