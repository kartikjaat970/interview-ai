import { useState, useEffect } from "react";
import api from "../api";
import Message from "./Message";
import Input from "./Input";
import Score from "./Score";

// Generate a random session ID once when the app loads to track this specific interview chat
const CURRENT_SESSION_ID = `session-${Math.random().toString(36).substr(2, 9)}`;

export default function Chat() {
  // Initialize with a welcome message from the AI interviewer
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      author: "AI",
      text: "Hello! Welcome to your technical interview. To get started, could you briefly introduce yourself and tell me what role you are interviewing for?"
    }
  ]);
  const [score, setScore] = useState(50);

  const send = async (text) => {
    if (!text.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    // 1. Instantly display user's text on screen
    setMessages((prev) => [...prev, { id: userMsgId, author: "You", text }]);

    try {
      // 2. Send the message along with our unique tracking session ID
      const res = await api.post("/interview", { 
        message: text,
        sessionId: CURRENT_SESSION_ID
      });

      // 3. Append the dynamic AI follow-up question and update the rating score
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, author: "AI", text: res.data.question }
      ]);
      setScore(res.data.score);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, author: "System", text: "Error connecting to server." }
      ]);
    }
  };

  return (
    <div>
      <div className="chat">
        {messages.map((m) => (
          <Message key={m.id} author={m.author} text={m.text} />
        ))}
      </div>
      <Input send={send} />
      <Score value={score} />
    </div>
  );
}