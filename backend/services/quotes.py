import requests

def get_quotes():
    quotes = []

    for _ in range(5):
        try:
            res = requests.get("https://zenquotes.io/api/random", verify=False)
            data = res.json()[0]

            quotes.append({
                "text": data["q"],
                "author": data["a"]
            })
        except:
            continue

    return quotes