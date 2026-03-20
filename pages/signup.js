// pages/signup.js
"use client";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleSignup = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, referralCode }),
    });

    const data = await res.json();

    if (data.token) {
      window.location.href = "/dashboard";
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Account</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Referral Code (optional)"
        onChange={(e) => setReferralCode(e.target.value)}
      />

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
