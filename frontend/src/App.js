import { useState, useRef, useEffect } from "react";
import "./App.css";

const EMOTION_CONFIG = {
  joy: {
    color: "#FFD93D",
    bg: "#0f0d00",
    glow: "#ffd93d",
    label: "Joy",
    icon: "◎",
  },
  sadness: {
    color: "#4D96FF",
    bg: "#00091a",
    glow: "#4d96ff",
    label: "Sadness",
    icon: "◎",
  },
  anger: {
    color: "#FF6B6B",
    bg: "#1a0000",
    glow: "#ff6b6b",
    label: "Anger",
    icon: "◎",
  },
  fear: {
    color: "#9B8FE8",
    bg: "#0b0915",
    glow: "#9b8fe8",
    label: "Fear",
    icon: "◎",
  },
  surprise: {
    color: "#00C2A8",
    bg: "#001a17",
    glow: "#00c2a8",
    label: "Surprise",
    icon: "◎",
  },
  disgust: {
    color: "#B07B6E",
    bg: "#120a08",
    glow: "#b07b6e",
    label: "Disgust",
    icon: "◎",
  },
  neutral: {
    color: "#9CA3AF",
    bg: "#111118",
    glow: "#9ca3af",
    label: "Neutral",
    icon: "◎",
  },
};

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const emotion = result
    ? (EMOTION_CONFIG[result.emotion] ?? EMOTION_CONFIG.neutral)
    : null;
  const MAX = 300;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const analyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Couldn't reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze();
  };

  const reset = () => {
    setText("");
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="scene"
      style={{
        "--scene-bg": emotion ? emotion.bg : "#0d0d18",
        "--glow-color": emotion ? emotion.glow : "transparent",
        "--accent": emotion ? emotion.color : "#fff",
      }}
    >
      <div className="glow" />
      <div className="grain" />

      <main className="card" role="main">
        {/* Header */}
        <header className="card-header">
          <div className="logo-mark">
            <span className="logo-pulse" />
          </div>
          <div>
            <h1 className="card-title">Emotion AI</h1>
            <p className="card-subtitle">Understand what you're feeling</p>
          </div>
        </header>

        {/* Input */}
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="text-input"
            placeholder="How are you feeling today…"
            value={text}
            maxLength={MAX}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Describe how you're feeling"
          />
          <div className="input-footer">
            <span className="hint">⌘ Enter to analyze</span>
            <span
              className={`char-count ${text.length > MAX * 0.85 ? "warn" : ""}`}
            >
              {text.length} / {MAX}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          className={`btn ${loading ? "loading" : ""}`}
          onClick={analyze}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            "Analyze emotion"
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="error-msg" role="alert">
            {error}
          </div>
        )}

        {/* Result */}
        {result && !error && (
          <div className="result" key={result.quote}>
            <div
              className="emotion-badge"
              style={{ "--badge-color": emotion.color }}
            >
              <span className="badge-dot" />
              {emotion.label}
            </div>

            <blockquote className="quote">
              <p className="quote-text">"{result.quote}"</p>
              <footer className="quote-author">— {result.author}</footer>
            </blockquote>

            <button className="reset-btn" onClick={reset}>
              Try another
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
