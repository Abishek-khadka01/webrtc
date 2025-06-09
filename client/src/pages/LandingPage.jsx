import React from "react";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <h1 style={styles.title}>Welcome to Video Call</h1>
        <p style={styles.subtitle}>
          Connect with anyone, anywhere — instantly and securely.
        </p>
        <button style={styles.button}>Get Started</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #2c3e50, #4ca1af)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
  },
  contentBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default LandingPage;
