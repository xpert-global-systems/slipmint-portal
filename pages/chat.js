import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botMessage = { role: "bot", text: data.reply };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>LuckmanWorld AI Assistant</h2>

      <div style={{
        border: "1px solid #ccc",
        padding: 10,
        height: 400,
        overflowY: "auto",
        borderRadius: 8,
        marginBottom: 10
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            marginBottom: 10
          }}>
            <div style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: 12,
              background: msg.role === "user" ? "#0070f3" : "#e5e5e5",
              color: msg.role === "user" ? "#fff" : "#000"
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <p>Thinking…</p>}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{
          padding: "10px 20px",
          borderRadius: 8,
          background: "#0070f3",
          color: "#fff",
          border: "none"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}
