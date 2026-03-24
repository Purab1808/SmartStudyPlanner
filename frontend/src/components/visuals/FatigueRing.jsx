import { clampPercent } from '../../utils/formatters';

export default function FatigueRing({ value, label }) {
  return (
    <div className="stack" style={{ justifyItems: 'center' }}>
      <div className="ring" style={{ '--value': clampPercent(value, 10) }}>
        <strong>{value ?? '-'}</strong>
      </div>
      <div className="stat-note">{label}</div>
    </div>
  );
}
