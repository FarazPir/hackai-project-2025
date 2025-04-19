import React, { useState } from 'react';

function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = { role: "bot", text: "❌ Failed to connect to chatbot." };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.userMessage : styles.botMessage),
            }}
          >
            <span style={styles.sender}>
              {msg.role === "user" ? "You" : "🤖 Bot"}
            </span>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.iconButton}>➤</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Nunito, sans-serif",
    backgroundColor: "#fef9f4",
    minHeight: "100vh",
  },
  chatBox: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    height: "400px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    marginBottom: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  message: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
    lineHeight: "1.4",
  },
  userMessage: {
    backgroundColor: "#cde7ff",
    alignSelf: "flex-end",
    marginLeft: "auto",
    textAlign: "right",

  },
  botMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    marginRight: "auto",
    textAlign: "left",
  },
  sender: {
    fontSize: "0.75em",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
    color: "#555",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "1em",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1em",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  iconButton: {
    padding: "10px 16px",
    fontSize: "1.2em",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ChatUI;
