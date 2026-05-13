export default function BarChartCard({ title, items, keyName, dataKey, colorClass = 'bar' }) {
  const max = Math.max(...items.map((item) => item[dataKey] || 0), 1);

  return (
    <div className="chart-card">
      <div className="section-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-shell">
        <div className="bar-chart">
          {items.map((item) => (
            <div
              key={item[keyName]}
              className={colorClass}
              style={{ height: `${Math.max(16, ((item[dataKey] || 0) / max) * 180)}px` }}
              title={`${item[keyName]}: ${item[dataKey] || 0}`}
            >
              <span>{item[keyName]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
