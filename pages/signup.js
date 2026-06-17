"use client";

import { useState } from "react";
import { signup } from "../services/auth";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    occupation: "",
    email: "",
    password: "",
    referral: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.includes("@")) return "Enter a valid email";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await signup(
        form.email.trim(),
        form.password.trim()
      );

      if (!result.success) {
        throw new Error(result.message || "Signup failed");
      }

      const token = result.token;

      const res = await fetch("/api/user/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          occupation: form.occupation.trim(),
          referral: form.referral.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Profile creation failed");
      }

      setSuccess(true);

      // IMPORTANT FLOW:
      // After signup → user should verify email → then login
      setTimeout(() => {
        window.location.href = "/check-email";
      }, 1500);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successBox}>
        <h2>Account created successfully</h2>
        <p>Please verify your email to continue.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="occupation"
          placeholder="Occupation"
          value={form.occupation}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="referral"
          placeholder="Referral Code (optional)"
          value={form.referral}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
  },
  form: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "12px",
    background: "#111827",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    color: "white",
    marginBottom: "10px",
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
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#ef4444",
    fontSize: "14px",
  },
  successBox: {
    color: "white",
    textAlign: "center",
    padding: "40px",
  },
};