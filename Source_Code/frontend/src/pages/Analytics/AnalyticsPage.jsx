import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/cards/StatCard';
import BarChartCard from '../../components/charts/BarChartCard';
import LineChartCard from '../../components/charts/LineChartCard';
import EmptyState from '../../components/feedback/EmptyState';
import InlineMessage from '../../components/feedback/InlineMessage';
import { analyticsApi } from '../../services/api';
import FatigueRing from '../../components/visuals/FatigueRing';

export default function AnalyticsPage() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    studyTime: null,
    fatiguePattern: null,
    productivity: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [studyRes, fatigueRes, productivityRes] = await Promise.all([
          analyticsApi.studyTime(),
          analyticsApi.fatiguePattern(),
          analyticsApi.productivityScore()
        ]);

        setState({
          loading: false,
          error: '',
          studyTime: studyRes.data,
          fatiguePattern: fatigueRes.data,
          productivity: productivityRes.data
        });
      } catch (err) {
        setState({
          loading: false,
          error: err?.response?.data?.message || 'Unable to load analytics',
          studyTime: null,
          fatiguePattern: null,
          productivity: null
        });
      }
    };

    load();
  }, []);

  const fatigueTrend = state.fatiguePattern?.trend || [];
  const summaryBars = [
    { metric: 'Study', value: state.studyTime?.totalStudyHours || 0 },
    { metric: 'Completed', value: state.studyTime?.completedTasks || 0 },
    { metric: 'Pending', value: state.productivity?.summary?.pendingTasks || 0 }
  ];

  return (
    <AppLayout
      title="Analytics"
      description="Track how study volume, fatigue trends, and task completion combine into your weekly productivity pattern."
    >
      {state.loading ? (
        <div className="stats-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="stat-card" key={index}>
              <div className="skeleton" style={{ width: '38%' }} />
              <div className="skeleton" style={{ height: 28, marginTop: 16 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="page-grid">
          <InlineMessage type="error" message={state.error} />

          <section className="stats-grid">
            <StatCard label="Total study hours" value={state.studyTime?.totalStudyHours || 0} note="Saved across schedule entries" />
            <StatCard label="Completed tasks" value={state.studyTime?.completedTasks || 0} note="Tasks marked finished" />
            <StatCard label="Daily average" value={state.studyTime?.averageDailyStudyHours || 0} note="Average scheduled study hours" />
            <StatCard label="Productivity" value={`${state.productivity?.productivityScore || 0}%`} note="Weighted completion and wellbeing score" />
          </section>

          {fatigueTrend.length ? (
            <div className="two-col">
              <LineChartCard title="Fatigue trend" items={fatigueTrend} dataKey="fatigueLevel" max={10} />
              <div className="panel stack" style={{ alignItems: 'center' }}>
                <div className="section-header">
                  <h3>Current wellbeing mix</h3>
                </div>
                <FatigueRing value={state.fatiguePattern.averages.fatigueLevel} label="Average fatigue" />
                <div className="item-meta" style={{ justifyContent: 'center' }}>
                  <span className="badge badge-danger">Stress {state.fatiguePattern.averages.stressLevel}</span>
                  <span className="badge badge-success">Motivation {state.fatiguePattern.averages.motivationLevel}</span>
                  <span className="badge badge-accent">Sleep {state.fatiguePattern.averages.sleepHours}h</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="No analytics history yet" description="Log mental-load entries and generate schedules to build your charts." />
          )}

          <BarChartCard title="Productivity summary" items={summaryBars} keyName="metric" dataKey="value" />
        </div>
      )}
    </AppLayout>
  );
}
