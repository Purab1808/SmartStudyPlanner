export default function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-copy">
          <span className="eyebrow">Preparing workspace</span>
          <h1>{label}</h1>
          <p>The planner is syncing your profile, schedule, and mental-load history.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="stack">
          <div className="skeleton" style={{ height: 18, width: '42%' }} />
          <div className="skeleton" style={{ height: 12, width: '68%' }} />
          <div className="skeleton" style={{ height: 52 }} />
          <div className="skeleton" style={{ height: 52 }} />
          <div className="skeleton" style={{ height: 52, width: '55%' }} />
        </div>
      </div>
    </div>
  );
}
