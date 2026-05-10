import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save extra details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        occupation,
        email,
      });

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.card}>
          <span style={styles.tag}>Member Access</span>
          <h1 style={styles.title}>Create Your SlipMint Account</h1>
          <p style={styles.subtitle}>
            Register to access the Founder Vault, premium research, and member-only updates.
          </p>

          <form onSubmit={handleSignup} style={styles.form}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>Occupation</label>
            <input
              type="text"
              placeholder="Occupation"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Login here
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
  },
  title: {
    fontSize: "34px",
    margin: "0 0 12px",
  },
  subtitle: {
    color: "#b8c7d9",
    lineHeight: 1.7,
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  label: {
    fontSize: "14px",
    color: "#dce7f3",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    border: "none",
    background: "#22c55e",
    color: "#081120",
    padding: "14px 18px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "4px",
  },
  footerText: {
    marginTop: "18px",
    color: "#b8c7d9",
    fontSize: "14px",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
    fontWeight: 700,
  },
};
