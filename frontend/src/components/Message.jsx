export default function Message({ author, text }) {
  // Create a clean class modifier depending on who sent the message
  const speakerClass = author === "You" ? "user" : "ai";

  return (
    <div className={`message ${speakerClass}`}>
      <strong>{author}:</strong>
      <p style={{ margin: "5px 0 0 0" }}>{text}</p>
    </div>
  );
}