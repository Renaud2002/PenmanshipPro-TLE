from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
from socket.infer import WritingInferrer

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
def handle_predict(data):
    print(writing.infer(data))
    socketio.emit('prediction', writing.infer(data))

if __name__ == '__main__':
    socketio.run(app)