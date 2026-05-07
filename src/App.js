import { useState, useRef, useEffect } from "react";

function App() {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("beginner");
  const [weeks, setWeeks] = useState(8);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messageAnim = {
  animation: "fadeIn 0.25s ease-out",
};

  const user = { email: "demo@aistudycoach.com" };

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const generatePlan = async () => {
    if (!goal || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: `${goal} (${level} • ${weeks} weeks)` },
    ]);

    setHistory((prev) => [...prev, goal]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level, weeks }),
      });

      const data = await response.json();
      const text = data.plan || "Something went wrong";

      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      let current = "";
      let i = 0;

      const interval = setInterval(() => {
        current += text[i] || "";
        i++;

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "ai", text: current };
          return copy;
        });

        if (i >= text.length) clearInterval(interval);
      }, 8);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error connecting to backend" },
      ]);
    }

    setGoal("");
    setLoading(false);
    inputRef.current?.focus();
  };

  const clearChat = () => setMessages([]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  return (
    <div style={styles.page}>
      <div style={styles.glow}></div>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <h1 style={styles.title}>AI Study Coach ✨</h1>
          </div>

          <p style={styles.subtitle}>
            Turn your goals into structured learning roadmaps
          </p>

          <div style={styles.userRow}>
            <span style={styles.userText}>{user.email}</span>
            <button onClick={clearChat} style={styles.clearBtn}>
              Clear Chat
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div style={styles.chatBox}>
          {isEmpty && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎯</div>

              <h2 style={{ marginTop: 10, fontSize: 18 }}>
                Build your personalized study plan
              </h2>

              <p style={{ marginTop: 8, color: "#999", fontSize: 13 }}>
                Example: “I want to learn cybersecurity in 8 weeks”
              </p>

              <div style={{ marginTop: 12, fontSize: 12, color: "#bbb" }}>
                Tip: Be specific → better AI results
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...messageAnim,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#e8b7c5,#d99cb0)"
                    : "#f9f9fb",
                color: msg.role === "user" ? "white" : "#333",
              }}
            >
              {msg.role === "ai" && msg.text && (
                <button
                  onClick={() => copyToClipboard(msg.text)}
                  style={styles.copyBtn}
                >
                  copy
                </button>
              )}

              {msg.role === "ai"
                ? msg.text.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: 10,
                        lineHeight: 1.5,
                        fontWeight: line.includes("Week") ? "600" : "400",
                      }}
                    >
                      {line}
                    </div>
                  ))
                : msg.text}
            </div>
          ))}

          {loading && (
            <div style={styles.loading}>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
              <span style={{ color: "#aaa" }}>
                AI is building your plan...
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* CONTROLS */}
        <div style={styles.controls}>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={styles.select}
          >
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>

          <select
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            style={styles.select}
          >
            <option value={4}>4 Weeks</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>
        </div>

        {/* INPUT */}
        <div style={styles.inputRow}>
          <input
            ref={inputRef}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generatePlan()}
            placeholder="e.g. Learn cybersecurity, become job-ready..."
            style={styles.input}
            disabled={loading}
          />

          <button onClick={generatePlan} style={styles.button}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#fff5f8,#ffffff)",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 500,
    height: 500,
    background: "rgba(232,183,197,0.25)",
    borderRadius: "50%",
    filter: "blur(120px)",
    top: -120,
    left: -120,
  },

  container: {
    width: 560,
    height: 780,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(25px)",
    borderRadius: 28,
    boxShadow: "0 40px 120px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },

  header: { padding: 24, borderBottom: "1px solid #eee" },
  brandRow: { display: "flex", justifyContent: "space-between" },
  title: { margin: 0, fontSize: 22, fontWeight: 600 },
  subtitle: { fontSize: 13, color: "#888", marginTop: 6 },

  userRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
  },

  userText: { fontSize: 11, color: "#888" },

  chatBox: {
    flex: 1,
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  emptyState: { textAlign: "center", marginTop: 80, color: "#aaa" },
  emptyIcon: { fontSize: 40 },

message: {
  padding: "14px 16px",
  borderRadius: 16,
  maxWidth: "80%",
  fontSize: 13,
  position: "relative", // 👈 ADD THIS HERE
},

  loading: { display: "flex", gap: 6 },

  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#e8b7c5",
  },

  controls: { display: "flex", gap: 10, padding: "0 18px 10px" },

  select: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #eee",
  },

  inputRow: {
    display: "flex",
    padding: 18,
    gap: 10,
    borderTop: "1px solid #eee",
  },

  input: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    border: "1px solid #eee",
  },

  button: {
    padding: "14px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#e8b7c5,#d89caf)",
    color: "white",
    fontWeight: 600,
  },

  clearBtn: {
    fontSize: 11,
    background: "transparent",
    border: "none",
    color: "#aaa",
    cursor: "pointer",
  },

  copyBtn: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 10,
    background: "#fff",
    border: "none",
    borderRadius: 6,
  },
};

export default App;