import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { login } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem("token", result.token);
      window.location.href = "/dashboard";
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.card}>
          <span style={styles.tag}>Member Access</span>
          <h1 style={styles.title}>Login to SlipMint</h1>
          <p style={styles.subtitle}>
            Access the Founder Vault, premium research, and member-only updates.
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <p style={styles.footerText}>
            Do not have an account?{" "}
            <Link href="/signup" style={styles.link}>
              Create one
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

const styles = { /* your styles unchanged */ };
