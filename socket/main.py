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


@app.errorhandler(404)
def url_error(e):
    return """
    Wrong URL!
    <pre>{}</pre>""".format(e), 404


@app.errorhandler(500)
def server_error(e):
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))


@socketio.on('predict')
def handle_predict(json):
    data = js.loads(json)
    data = np.asarray(data, dtype=np.uint8)
    # Downscale to 28x28
    data = cv2.resize(data, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)
    
    #img = Image.fromarray(data, 'RGB')
    #img.save('my.png')
    #img.show()
    # Convert from 28,28,3 to 28,28,1
    data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
    socketio.emit('prediction', writing.infer(data))


if __name__ == '__main__':
    socketio.run(app)