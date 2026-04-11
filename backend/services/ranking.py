from sentence_transformers import SentenceTransformer
from utils.similarity import cosine_similarity

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def get_best_quote(user_text, quotes):
    user_vec = embedder.encode(user_text)

    best_quote = None
    best_score = -1

    for q in quotes:
        quote_vec = embedder.encode(q["text"])
        score = cosine_similarity(user_vec, quote_vec)

        if score > best_score:
            best_score = score
            best_quote = q

    return best_quote