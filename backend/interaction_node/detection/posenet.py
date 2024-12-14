import json
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import cv2

from .detection_algorithm import DetectionAlgorithm

PIXEL_SKIP = 1
WIDTH = 640
HEIGHT = 480

# Helper functions
def get_keypoints(frame, keypoints, threshold, selected_keypoints):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))
    keypoint = selected_keypoints[0]
    selected_keypoint = shaped[keypoint]
    ky, kx, kp_conf = selected_keypoint
    if kp_conf > threshold:
        coords = convert_to_scale(kx, ky)
        return coords
    else:
        return None

def convert_to_scale(x, y):
    return {'x': round(abs((x / WIDTH) - 1), 2), 'y': round(abs((y / HEIGHT) - 1), 2)}

def loop_through_people(frame, keypoints_with_scores, threshold, selected_keypoints):
    points = []
    for person in keypoints_with_scores:
        key_points_for_person = get_keypoints(frame, person, threshold, selected_keypoints)
        if key_points_for_person is not None:
            points.append(key_points_for_person)
    return points

# Core processing class
class Posenet(DetectionAlgorithm):
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
        self.isRunning = True
        self.cap = cv2.VideoCapture(0)
        desired_fps = 10  # Set desired frame rate
        self.cap.set(cv2.CAP_PROP_FPS, desired_fps)

        # Reduce the resolution
        desired_width = 320  # Lower resolution width
        desired_height = 240  # Lower resolution height
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)
        self.model = hub.load('https://tfhub.dev/google/movenet/multipose/lightning/1')
        movenet = self.model.signatures['serving_default']
        threshold = self.algorithm_config['threshold']
        selected_keypoints = self.algorithm_config['keypoints']
        while self.cap.isOpened() and self.isRunning:
            ret, frame = self.cap.read()
            if not ret:
                break
            img = tf.image.resize_with_pad(tf.expand_dims(frame, axis=0), 256, 256)
            input_image = tf.cast(img, dtype=tf.int32)
            results = movenet(input_image)
            keypoints_with_scores = results['output_0'].numpy()[:, :, :51].reshape((6, 17, 3))
            selected_points = loop_through_people(frame, keypoints_with_scores, threshold,selected_keypoints )
            print(json.dumps(selected_points), flush=True)

        self.cap.release()

    def stop_running(self):
        self.isRunning = False

    def get_cluster_coords(self):
        return self.cluster_buffer_data

    def get_smoothed_cluster_coords(self):
        return self.get_cluster_coords()

# Buffer update functions
def update_cluster_buffer(latest_point, cluster_buffer, window_size):
    if len(cluster_buffer['x']) == window_size or (latest_point is None and len(cluster_buffer['x']) > 0):
        cluster_buffer['sum_x'] -= cluster_buffer['x'].pop(0)
    if len(cluster_buffer['y']) == window_size or (latest_point is None and len(cluster_buffer['y']) > 0):
        cluster_buffer['sum_y'] -= cluster_buffer['y'].pop(0)

    if latest_point is not None:
        x = latest_point['x']
        y = latest_point['y']
        cluster_buffer['x'].append(x)
        cluster_buffer['y'].append(y)
        cluster_buffer['sum_x'] += x
        cluster_buffer['sum_y'] += y

    return cluster_buffer

def get_movement_value(cluster_data):
    x = -2
    y = -2
    if len(cluster_data['x']) > 0:
        x = cluster_data['sum_x'] / len(cluster_data['x'])
    if len(cluster_data['y']) > 0:
        y = cluster_data['sum_y'] / len(cluster_data['y'])
    return {'x': x, 'y': y}
