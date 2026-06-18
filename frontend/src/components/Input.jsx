import { useState } from "react";

export default function Input({ send }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          send(value);
          setValue("");
        }}
      >
        Send
      </button>
    </div>
  );
}