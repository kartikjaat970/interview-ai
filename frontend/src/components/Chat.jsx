import { useState, useRef, useEffect } from "react";
import api from "../api";
import Message from "./Message";
import Input from "./Input";
import Score from "./Score";

// One session ID per page load, used to keep this interview's history together
const CURRENT_SESSION_ID =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? `session-${crypto.randomUUID()}`
    : `session-${Math.random().toString(36).slice(2, 11)}`;

export default function Chat() {
  // Initialize with a welcome message from the AI interviewer
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      author: "AI",
      text: "Hello! Welcome to your technical interview. To get started, could you briefly introduce yourself and tell me what role you are interviewing for?",
    },
  ]);
  const [score, setScore] = useState(50);
  const [loading, setLoading] = useState(false);

  const nextId = useRef(0);
  const bottomRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const newId = (prefix) => `${prefix}-${nextId.current++}`;

  const send = async (text) => {
    if (!text.trim() || loading) return;

    // 1. Instantly display the user's text
    setMessages((prev) => [...prev, { id: newId("user"), author: "You", text }]);
    setLoading(true);

    try {
      // 2. Send the message along with our session ID
      const res = await api.post("/interview", {
        message: text,
        sessionId: CURRENT_SESSION_ID,
      });

      // 3. Append the AI follow-up question and update the rating score
      setMessages((prev) => [
        ...prev,
        { id: newId("ai"), author: "AI", text: res.data.question },
      ]);
      setScore(res.data.score);
    } catch (error) {
      console.error(error);
      // Show the server's reason when there is one (e.g. missing API key / AI down)
      const reason =
        error.response?.data?.error || "Error connecting to server.";
      setMessages((prev) => [
        ...prev,
        { id: newId("err"), author: "System", text: reason },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="chat">
        {messages.map((m) => (
          <Message key={m.id} author={m.author} text={m.text} />
        ))}
        {loading && <Message author="AI" text="Thinking..." />}
        <div ref={bottomRef} />
      </div>
      <Input send={send} disabled={loading} />
      <Score value={score} />
    </div>
  );
}
