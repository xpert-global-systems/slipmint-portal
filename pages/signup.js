"use client";
import { useState } from "react";
import { signup } from "../services/auth"; // <-- use your backend signup

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signup(email, password, fullName);

    if (result.success) {
      localStorage.setItem("token", result.token);
      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1500);
    } else {
      setError(result.message || "Signup failed");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successBox}>
            <p style={styles.successIcon}>✓</p>
            <h1 style={styles.successTitle}>Account Created!</h1>
            <p style={styles.successMessage}>Redirecting to setup...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.tag}>Get Started</span>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Join SlipMint and start tracking your trading performance
        </p>

        <form onSubmit={handleSignup} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Occupation</label>
          <input
            type="text"
            placeholder="Your occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Referral Code (Optional)</label>
          <input
            type="text"
            placeholder="If you have one"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#081120",
    color: "#fff",
    padding: "40px 20px 60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#0f1b2d",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "32px 24px",
    boxSizing: "border-box",
  },
  tag: {
    display: "inline-block",
    color: "#22c55e",
    fontWeight: 700,
    marginBottom: "12px",
    fontSize: "12px",
  },
  title: {
    fontSize: "34px",
    margin: "0 0 12px",
  },
  subtitle: {
    color: "#b8c7d9",
    lineHeight: 1.7,
    marginBottom: "24px",
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  label: {
    fontSize: "13px",
    color: "#dce7f3",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#081120",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 16px",
    background: "#22c55e",
    color: "#081120",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "6px",
  },
  footerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#b8c7d9",
    marginTop: "16px",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
    fontWeight: 600,
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0",
  },
  successBox: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    fontSize: "60px",
    margin: "0 0 20px",
  },
  successTitle: {
    fontSize: "28px",
    margin: "0 0 12px",
  },
  successMessage: {
    color: "#b8c7d9",
    margin: 0,
  },
};
