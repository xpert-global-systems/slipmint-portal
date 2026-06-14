import { useState } from "react";
import styles from "../styles/SubscribeForm.module.css";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/subscribe/brevo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.message);
        setEmail("");
      } else {
        setStatus(data.error);
      }
    } catch (err) {
      setStatus("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Get market insights and updates</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {status && <p className={styles.errorText}>{status}</p>}
    </section>
  );
}