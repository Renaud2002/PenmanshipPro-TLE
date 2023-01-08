from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from infer import WritingInferrer
import numpy as np
from PIL import Image
import json as js
import cv2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
writing = WritingInferrer()


@app.route('/')
def index():
    return "Index Html"


@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))


@socketio.on('predict')
def handle_predict(json):
    data = js.loads(json)
    print(data)
    
    #Flip the image so 255 is white and 0 is black
    data = 255 - np.asarray(data, dtype=np.uint8)
    # Downscale to 28x28
    data = cv2.resize(data, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)
    
    #img = Image.fromarray(data, 'RGB')
    #img.save('my.png')
    #img.show()
    # Convert from 28,28,3 to 28,28,1
    data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
    socketio.emit('prediction', writing.infer(data))

@socketio.on('multiple')
def handle_multiple(json):
    print('received json: ' + str(json))
    data = js.loads(json)
    print(data)
    returnArray = []
    for item in data:
        print(item)
        tempArray = []
        tempArray.append(item[0])
        #Flip the image so 255 is white and 0 is black
        temp = 255 - np.asarray(item[1], dtype=np.uint8)
        # Downscale to 28x28
        temp = cv2.resize(temp, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)
    
        # Convert from 28,28,3 to 28,28,1
        temp = cv2.cvtColor(temp, cv2.COLOR_BGR2GRAY)
        result = writing.infer(temp)
        tempArray.append(result[0])
        tempArray.append(result[1])
        returnArray.append(tempArray)
    print(returnArray)
    socketio.emit('multiple', returnArray)


if __name__ == '__main__':
    socketio.run(app)