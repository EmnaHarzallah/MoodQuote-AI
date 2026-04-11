from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import requests

app = Flask(__name__)
CORS(app)

# Emotion AI model
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

#  Map emotion → quote category
emotion_to_tags = {
    "joy": "happiness|inspirational",
    "sadness": "life|healing",
    "anger": "wisdom|calm",
    "fear": "courage|strength",
    "surprise": "life|philosophy",
    "disgust": "self-improvement",
    "neutral": "inspirational"
}

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    # Predict emotion
    result = classifier(text)[0][0]
    emotion = result["label"]

    # Get quote from internet
    tags = emotion_to_tags.get(emotion, "inspirational")

    response = requests.get(
        f"https://api.quotable.io/random?tags={tags}"
    )

    quote_data = response.json()

    return jsonify({
        "emotion": emotion,
        "quote": quote_data["content"],
        "author": quote_data["author"]
    })

if __name__ == "__main__":
    app.run(debug=True)