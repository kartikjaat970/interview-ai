export default function Message({ author, text }) {
  return (
    <div className="message">
      <strong>{author}</strong>
      <p>{text}</p>
    </div>
  );
}