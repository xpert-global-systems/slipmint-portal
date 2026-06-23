// pages/admin/vault-content.js
// Internal-only page for adding/removing Founder Vault content.
// Not linked from anywhere in the public nav — protected by ADMIN_API_KEY,
// entered once and kept in sessionStorage for this browser tab session.
//
// This page is intentionally plain — it's a tool for you, not a customer-facing
// page. If you want it locked down further, you could also add IP allowlisting
// at the hosting level, but the admin key check is the real gate.

import { useEffect, useState } from "react";

const CATEGORIES = [
  { value: "founder_notes", label: "Founder Notes" },
  { value: "premium_research", label: "Premium Research" },
  { value: "watchlist", label: "Strategic Watchlist" },
];

export default function VaultContentAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ category: "founder_notes", title: "", body: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("vaultAdminKey");
    if (stored) setAdminKey(stored);
  }, []);

  useEffect(() => {
    if (adminKey) loadItems();
  }, [adminKey]);

  function handleUnlock(e) {
    e.preventDefault();
    sessionStorage.setItem("vaultAdminKey", keyInput);
    setAdminKey(keyInput);
  }

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vault-content?key=${encodeURIComponent(adminKey)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
      if (err.message === "Unauthorized") {
        sessionStorage.removeItem("vaultAdminKey");
        setAdminKey("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vault-content?key=${encodeURIComponent(adminKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setForm({ category: form.category, title: "", body: "" });
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(
        `/api/admin/vault-content?key=${encodeURIComponent(adminKey)}&id=${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!adminKey) {
    return (
      <div style={styles.page}>
        <form onSubmit={handleUnlock} style={styles.unlockCard}>
          <h2 style={styles.h2}>Vault Content Admin</h2>
          <input
            type="password"
            placeholder="Admin API key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.h2}>Vault Content Admin</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleCreate} style={styles.card}>
          <h3 style={styles.h3}>New entry</h3>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={styles.input}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Body — plain text, blank lines become paragraph breaks"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={8}
            style={{ ...styles.input, fontFamily: "inherit", resize: "vertical" }}
          />
          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? "Saving..." : "Publish to Vault"}
          </button>
        </form>

        <h3 style={styles.h3}>Existing entries {loading && "(loading...)"}</h3>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.itemMeta}>
              {CATEGORIES.find((c) => c.value === item.category)?.label || item.category}
            </div>
            <strong style={{ color: "#fff" }}>{item.title}</strong>
            <p style={styles.itemBody}>{item.body}</p>
            <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>
              Delete
            </button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No entries yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#050a11", color: "#fff", padding: "40px 20px" },
  container: { maxWidth: "700px", margin: "0 auto" },
  unlockCard: {
    maxWidth: "360px", margin: "100px auto", display: "flex", flexDirection: "column", gap: "12px",
  },
  h2: { fontSize: "24px", marginBottom: "16px" },
  h3: { fontSize: "16px", color: "#94a3b8", margin: "28px 0 12px" },
  card: {
    background: "#0b121f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
    padding: "20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px",
  },
  input: {
    padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
    background: "#0f1b2d", color: "#fff", fontSize: "14px",
  },
  button: {
    padding: "12px", borderRadius: "8px", border: "none", background: "#22c55e",
    color: "#050a11", fontWeight: 700, cursor: "pointer",
  },
  deleteButton: {
    alignSelf: "flex-start", padding: "8px 14px", borderRadius: "6px",
    border: "1px solid rgba(248,113,113,0.4)", background: "transparent",
    color: "#f87171", fontSize: "12px", cursor: "pointer",
  },
  itemMeta: { fontSize: "11px", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px" },
  itemBody: { color: "#cbd5e1", whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: 1.6, margin: 0 },
  error: { color: "#f87171", marginBottom: "16px" },
};
