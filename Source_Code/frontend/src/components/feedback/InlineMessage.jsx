export default function InlineMessage({ type = 'success', message }) {
  if (!message) return null;
  return <div className={`toast ${type}`}>{message}</div>;
}
