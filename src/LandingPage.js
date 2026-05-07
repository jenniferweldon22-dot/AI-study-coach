export default function LandingPage({ onStart }) {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>AI Study Coach</h1>
      <p style={styles.subtitle}>
        Personalized learning roadmaps powered by AI
      </p>

      <button onClick={onStart} style={styles.button}>
        Get Started
      </button>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#fff5f8,#ffffff)",
    fontFamily: "Inter",
    textAlign: "center",
    padding: 20
  },
  title: { fontSize: 48, marginBottom: 10 },
  subtitle: { color: "#777", marginBottom: 30 },
  button: {
    padding: "14px 24px",
    borderRadius: 12,
    border: "none",
    background: "#e8b7c5",
    color: "white",
    cursor: "pointer"
  }
};