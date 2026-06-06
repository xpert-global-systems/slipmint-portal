"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../lib/firebase";

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

    try {


      // 1. Create user in Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);
const firebaseUser = cred.user;

// Send verification email
await sendEmailVerification(firebaseUser);

// Get Firebase ID token
const token = await firebaseUser.getIdToken(true);

      // 3. Send profile data to your backend (PostgreSQL)
      const res = await fetch(
        "/api/user/create-profile"
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            phone,
            occupation,
            dob: "", // add DOB field to your form later
            ssn: "", // add SSN field to your form later
            referral,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Profile save failed");
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
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

const styles = { /* your styles unchanged */ };
