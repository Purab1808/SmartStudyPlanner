export default function ProgressBar({ value, max = 100, tone = 'accent' }) {
  const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="progress-track">
      <div className={`progress-bar tone-${tone}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
