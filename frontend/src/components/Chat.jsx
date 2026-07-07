import { useState } from "react";
import api from "../api";
import Message from "./Message";
import Input from "./Input";
import Score from "./Score";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);

  const send = async (text) => {
    if (!text.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    setMessages((prev) => [...prev, { id: userMsgId, author: "You", text }]);

    try {
      const res = await api.post("/interview", { message: text });

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