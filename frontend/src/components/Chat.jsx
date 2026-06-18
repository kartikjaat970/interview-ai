import { useState } from "react";
import api from "../api";
import Message from "./Message";
import Input from "./Input";
import Score from "./Score";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);

  const send = async (text) => {
    const next = [...messages, { author: "You", text }];
    setMessages(next);

    const res = await api.post("/interview", { message: text });

    setMessages([...next, { author: "AI", text: res.data.question }]);
    setScore(res.data.score);
  };

  return (
    <div>
      <div className="chat">
        {messages.map((m, i) => (
          <Message key={i} author={m.author} text={m.text} />
        ))}
      </div>
      <Input send={send} />
      <Score value={score} />
    </div>
  );
}