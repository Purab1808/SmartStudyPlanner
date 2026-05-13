export default function Badge({ children, tone = 'muted', className = '' }) {
  return <span className={`badge badge-${tone} ${className}`.trim()}>{children}</span>;
}
