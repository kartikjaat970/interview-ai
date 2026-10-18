import { useState } from "react";

export default function Input({ send, disabled = false }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (disabled || !value.trim()) return;
    send(value);
    setValue("");
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Type your answer..."
        disabled={disabled}
      />
      <button onClick={submit} disabled={disabled || !value.trim()}>
        {disabled ? "..." : "Send"}
      </button>
    </div>
  );
}
