import cv2
from flask import Flask, render_template, Response
import threading
from flask_cors import CORS
from segment_filter import segment_frame

class MaskProcessor:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.output_frame = None
        self.lock = threading.Lock()
        self.video_capture = cv2.VideoCapture(0)
        if not self.video_capture.read()[0]:
            self.video_capture = cv2.VideoCapture(0)
        
        self.app.add_url_rule("/", "index", self.index)
        self.app.add_url_rule("/video_feed", "video_feed", self.video_feed)
    def set_config(self, config):
        print(config)
        
    def analyze(self):
        while self.video_capture.isOpened():
            ret, frame = self.video_capture.read()
            if not ret:
                continue
            
            frame = cv2.flip(frame, 1)
            segmented = segment_frame(frame)
            
            with self.lock:
                self.output_frame = segmented
    
    def generate(self):
        while True:
            with self.lock:
                if self.output_frame is None:
                    continue
                
                flag, encoded_image = cv2.imencode(".jpg", self.output_frame)
                if not flag:
                    continue
            
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
                   bytearray(encoded_image) + b'\r\n')
    
    def index(self):
        return render_template("index.html")
    
    def video_feed(self):
        return Response(self.generate(), mimetype="multipart/x-mixed-replace; boundary=frame")
    
    def start(self):
        t = threading.Thread(target=self.analyze)
        t.daemon = True
        t.start()
        self.app.run(host="0.0.0.0", port=8000, debug=True, threaded=True, use_reloader=False)
        self.video_capture.release()