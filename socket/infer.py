import tensorflow as tf

class WritingInferrer:
    def _init_(self):
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
        # Convert the image to RGB
        image = tf.image.grayscale_to_rgb(image)
        # Reshapes the image
        image = tf.reshape(image, [1, 244, 244, 3])
        # Gets the prediction
        prediction = self.predict(image)
        # Gets the prediction
        prediction = prediction['dense_1']
        # Gets the prediction
        prediction = prediction.numpy()
        # Gets the prediction
        prediction = prediction.argmax()
        return prediction

