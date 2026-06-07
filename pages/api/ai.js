import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }

    setLoading(true);

    try {
      const payload = { email, password, displayName };

      // Note the comma after the URL — required for valid JS syntax
      const res = await fetch("/api/user/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Failed to create profile");
      }

      const data = await res.json();
      setSuccess("Account created successfully.");
      setEmail("");
      setPassword("");
      setDisplayName("");

      // Optionally navigate to login or dashboard
      if (data.redirectTo) {
        router.push(data.redirectTo);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 12 }}>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            backgroundColor: "#0366d6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: 12 }}>
          Error: {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green", marginTop: 12 }}>
          {success}
        </p>
      )}
    </div>
  );
}