import { useState, useRef, useEffect } from "react";

const BACKEND_URL = "http://localhost:8000/api/chat/";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm your fintech assistant. Ask me anything about EMI, taxes, or investments." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.response }]);
    } catch {
      // Fallback to local logic if backend is unreachable
      const lower = userText.toLowerCase();
      let reply = "I'm not sure about that. Try asking about EMI, tax, or loans!";
      if (lower.includes("emi")) reply = "EMI = (P × R × (1+R)^N) / ((1+R)^N - 1). Use the calculator on the right!";
      else if (lower.includes("tax")) reply = "Tax depends on your income slab. Use the Tax Calculator to compute it instantly!";
      else if (lower.includes("loan")) reply = "Loan EMI depends on principal, rate, and tenure. Fill in the EMI calculator!";
      else if (lower.includes("hello") || lower.includes("hi")) reply = "Hello! How can I help you with your finances today?";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#0d0d0d",
      borderRight: "1px solid #1a1a2e",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid #1a1a2e",
        background: "linear-gradient(135deg, #0d0d0d 0%, #0a0f1e 100%)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #00f5ff33, #00f5ff11)",
            border: "1.5px solid #00f5ff66",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}>AI Assistant</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }} />
              <span style={{ color: "#00f5ffaa", fontSize: 11, letterSpacing: "0.05em" }}>ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        scrollbarWidth: "thin",
        scrollbarColor: "#1a1a2e transparent",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "82%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #00f5ff22, #00c8d422)"
                : "#1a1a2e",
              border: msg.role === "user"
                ? "1px solid #00f5ff44"
                : "1px solid #252540",
              color: msg.role === "user" ? "#00f5ff" : "#ccc",
              fontSize: 13,
              lineHeight: 1.5,
              boxShadow: msg.role === "user" ? "0 0 12px #00f5ff11" : "none",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "10px 16px",
              borderRadius: "16px 16px 16px 4px",
              background: "#1a1a2e",
              border: "1px solid #252540",
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#00f5ff88",
                  animation: `bounce 1.2s ${delay}s infinite ease-in-out`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid #1a1a2e",
        background: "#0d0d0d",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          gap: 8,
          background: "#111",
          border: "1px solid #252540",
          borderRadius: 12,
          padding: "6px 6px 6px 14px",
          transition: "border-color 0.2s",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about EMI, taxes..."
            disabled={isTyping}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 13,
              caretColor: "#00f5ff",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
            style={{
              background: "linear-gradient(135deg, #00f5ff, #00c8d4)",
              border: "none",
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 14,
              transition: "opacity 0.2s, transform 0.1s",
              opacity: isTyping ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(0.96)"; }}}
            onMouseLeave={e => { e.currentTarget.style.opacity = isTyping ? "0.5" : "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            ↑
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
