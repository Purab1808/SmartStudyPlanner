import { formatCompactDate } from '../../utils/formatters';

export default function LineChartCard({ title, items, dataKey, max = 10 }) {
  return (
    <div className="chart-card">
      <div className="section-header">
        <h3>{title}</h3>
      </div>
      <div className="line-chart">
        {items.map((item) => {
          const height = Math.max(20, ((item[dataKey] || 0) / max) * 170);
          return (
            <div className="line-column" key={`${item.date}-${dataKey}`}>
              <div className="line-stick" style={{ height }} />
              <div className="line-point" title={`${item[dataKey]}`}>
                <span>{formatCompactDate(item.date)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
