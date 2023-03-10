import tensorflow as tf


class WritingInferrer:

    def __init__(self):
        self.saved_path = 'model'
        self.model = tf.saved_model.load(self.saved_path)

        self.predict = self.model.signatures['serving_default']

    # Preprocesses the image
    def preprocess(self, image):
        # Normalizes the 2d array
        image = image / 255.0
        return image

    def infer(self, image=None):
        # Preprocesses the image
        image = self.preprocess(image)
        # Converts the image to a tensor
        image = tf.convert_to_tensor(image, dtype=tf.float32)
        
        # Reshapes the image
        image = tf.reshape(image, [1, 28, 28, 1])
        # Gets the prediction
        prediction = self.predict(image)['dense_21']
        # Gets the prediction
        prediction = prediction.numpy()
        # Get highest element in prediction
        percentage = prediction.max()
        # Gets the prediction
        prediction = prediction.argmax()
        return [int(prediction), float(percentage)]
