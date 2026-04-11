import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const emotionStyles = {
    joy: "#FFD93D",
    sadness: "#4D96FF",
    anger: "#FF6B6B",
    fear: "#6C63FF",
    surprise: "#00C2A8",
    disgust: "#7D5A50",
    neutral: "#A0A0A0",
  };

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const bgColor = result ? emotionStyles[result.emotion] : "#1e1e2f";

  return (
    <div className="app" style={{ background: bgColor }}>
      <div className="card">
        <h1>Emotion AI 💬</h1>

        <textarea
          placeholder="How are you feeling?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Emotion"}
        </button>

        {result && (
          <div className="result">
            <p className="quote">"{result.quote}"</p>
            <p className="author">- {result.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
