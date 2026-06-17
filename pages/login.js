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

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result?.success) {
        setError(result.message || "Login failed");
        return;
      }

      // store auth
      localStorage.setItem("token", result.token);

      router.push("/dashboard");
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
                cursor: loading ? "not-allowed" : "pointer",
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

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "12px",
    background: "#111827",
  },

  tag: {
    color: "#60a5fa",
    fontSize: "12px",
    marginBottom: "10px",
  },

  title: {
    color: "white",
    fontSize: "22px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    color: "#cbd5e1",
    fontSize: "13px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0b1220",
    color: "white",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
  },

  errorBox: {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  footerText: {
    marginTop: "15px",
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "center",
  },

  link: {
    color: "#60a5fa",
  },
};