"use client";
import { useState } from "react";
import { signup } from "../services/auth";

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
      const result = await signup(email.trim(), password.trim());

      if (!result.success) {
        throw new Error(result.message || "Signup failed");
      }

      const token = result.token;

      console.log("🚀 sending profile request...");

      const res = await fetch("/api/user/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          dob: "",
          ssn: "",
          referral: referral.trim(),
        }),
      });

      console.log("📡 status:", res.status);

      const text = await res.text();
      console.log("📦 raw:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Profile save failed");
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1500);

    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <h2>Account Created...</h2>;
  }

  return (
    <form onSubmit={handleSignup}>
      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Referral" value={referral} onChange={(e) => setReferral(e.target.value)} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}