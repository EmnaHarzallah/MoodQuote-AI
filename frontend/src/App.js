import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const emotionColors = {
    joy: "#FFD93D",
    sadness: "#4D96FF",
    anger: "#FF6B6B",
    fear: "#6C63FF",
    surprise: "#00C2A8",
    disgust: "#7D5A50",
    neutral: "#A0A0A0",
  };

  const analyze = async () => {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
  };

  const bgColor = result ? emotionColors[result.emotion] : "#ffffff";
  const saveQuote = () => {
    let saved = JSON.parse(localStorage.getItem("quotes") || "[]");

    saved.push(result);

    localStorage.setItem("quotes", JSON.stringify(saved));
  };
  const saved = JSON.parse(localStorage.getItem("quotes") || "[]");
  console.log(saved);
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: bgColor,
        transition: "0.5s",
      }}
    >
      <h1>Emotion Quote AI 💬</h1>

      <textarea
        rows="4"
        style={{ width: "300px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How are you feeling?"
      />

      <br />

      <button onClick={analyze}>Analyze Emotion</button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>"{result.quote}"</h3>
          <p>- {result.author}</p>
        </div>
      )}
    </div>
  );
}

export default App;
