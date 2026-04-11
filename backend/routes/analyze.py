from flask import Blueprint, request, jsonify
from services.emotion import detect_emotion
from services.quotes import get_quotes
from services.ranking import get_best_quote

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    emotion = detect_emotion(text)

    quotes = get_quotes()

    best = get_best_quote(text, quotes)

    return jsonify({
        "emotion": emotion,
        "quote": best["text"],
        "author": best["author"]
    })