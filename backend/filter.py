import cv2
from flask import Flask, render_template, Response
import threading

from segment_filter import segment_frame

# Initialize Flask app
app = Flask(__name__)

# Global variables
outputFrame = None
lock = threading.Lock()

# Initialize video capture object (external camera first, fallback to built-in camera)
video_capture = cv2.VideoCapture(0)
if not video_capture.read()[0]:
    video_capture = cv2.VideoCapture(0)

def analyze():
    global video_capture, outputFrame, lock

    while video_capture.isOpened():
        ret, frame = video_capture.read()
        if not ret:
            continue
     

        # Flip the frame horizontally for a mirrored effect
        frame = cv2.flip(frame, 1)
        segmented = segment_frame(frame)
        # Acquire the lock, set the output frame, and release the lock
        with lock:
            outputFrame = segmented

def generate():
    global outputFrame, lock


    while True:
        with lock:
            if outputFrame is None:
                continue

            # Encode the frame as JPEG
            (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
            if not flag:
                continue

        # Yield the output frame in byte format
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
               bytearray(encodedImage) + b'\r\n')

@app.route("/")
def index():
    # Render an HTML template
    return render_template("index.html")

@app.route("/video_feed")
def video_feed():
    print('Did this')
    # Serve the MJPEG stream
    return Response(generate(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    # Start a thread to capture and analyze video frames
    t = threading.Thread(target=analyze)
    t.daemon = True
    t.start()

    # Run Flask app
    app.run(host="0.0.0.0", port=8000, debug=True, threaded=True, use_reloader=False)

    # Release the video capture object
    video_capture.release()
