import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../services/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // optional: redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem("token", result.token);
      router.push("/dashboard");
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError("Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.card}>
          <span style={styles.tag}>Member Access</span>
          <h1 style={styles.title}>Login to SlipMint</h1>
          <p style={styles.subtitle}>
            Access your dashboard, Founder Vault, and trading tools.
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
            />

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p style={styles.footerText}>
            No account?{" "}
            <Link href="/signup" style={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}