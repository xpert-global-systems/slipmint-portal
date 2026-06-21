"use client";

import { useState } from "react";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Instantly clear input and append user message for a snappy UI experience
    setInput("");
    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput, history: messages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const botMessage = { 
        sender: "bot", 
        text: data?.reply || "No response received from terminal." 
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Show the real error so it's debuggable instead of a generic message
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div
        onClick={() => setOpen(!open)}
        style={styles.floatingButton}
      >
        💬
      </div>

      {/* Chat Interface Window */}
      {open && (
        <div style={styles.window}>
          {/* Header Panel */}
          <div style={styles.header}>
            <span>SlipMint AI Assistant</span>
          </div>

          {/* Interactive Messages Container */}
          <div style={styles.messagesArea}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={
                    msg.sender === "user" ? styles.userBubble : styles.botBubble
                  }
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* Dynamic Loading Response State */}
            {loading && (
              <div style={{ textAlign: "left" }}>
                <span style={styles.loadingText}>AI Agent is analyzing...</span>
              </div>
            )}
          </div>

          {/* Prompt Entry Box */}
          <div style={styles.inputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              placeholder={loading ? "Waiting for response..." : "Ask me anything..."}
              style={styles.input}
            />
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#3b82f6",
    color: "#fff",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 9999,
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
  },
  window: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "340px",
    height: "460px",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  },
  header: {
    padding: "14px 16px",
    background: "#0f172a",
    borderBottom: "1px solid #334155",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
  },
  messagesArea: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userBubble: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: "12px 12px 0 12px",
    background: "#3b82f6",
    color: "white",
    maxWidth: "85%",
    wordBreak: "break-word",
    textAlign: "left",
  },
  botBubble: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: "12px 12px 12px 0",
    background: "#1e293b",
    color: "#f8fafc",
    maxWidth: "85%",
    wordBreak: "break-word",
    border: "1px solid #334155",
    textAlign: "left",
  },
  loadingText: {
    fontSize: "12px",
    color: "#64748b",
    fontStyle: "italic",
    paddingLeft: "4px",
  },
  inputArea: {
    padding: "12px",
    borderTop: "1px solid #334155",
    background: "#0f172a",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0b1220",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },
};
