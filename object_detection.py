import cv2
import numpy as np
import json
import time
from flask import Flask, Response, jsonify

app = Flask(__name__)

# Initialize the webcam
cap = cv2.VideoCapture(0)

def detect_objects(frame):
    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Detect edges
    edges = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours based on area
    min_area = 500
    objects = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area]
    
    return objects

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            objects = detect_objects(frame)
            
            # Draw bounding boxes around detected objects
            for obj in objects:
                x, y, w, h = cv2.boundingRect(obj)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect')
def detect():
    success, frame = cap.read()
    if not success:
        return jsonify({"error": "Failed to capture frame"}), 500
    
    objects = detect_objects(frame)
    return jsonify({"objects_detected": len(objects)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)