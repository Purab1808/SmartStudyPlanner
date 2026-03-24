import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/cards/StatCard';
import EmptyState from '../../components/feedback/EmptyState';
import InlineMessage from '../../components/feedback/InlineMessage';
import FatigueRing from '../../components/visuals/FatigueRing';
import Badge from '../../components/ui/Badge';
import { analyticsApi, mentalLoadApi, scheduleApi, subjectsApi, tasksApi } from '../../services/api';
import { formatCompactDate, getDaysUntil, getWorkloadTone } from '../../utils/formatters';

export default function DashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    subjects: [],
    tasks: [],
    mentalLoads: [],
    schedules: [],
    studyTime: null,
    productivity: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [subjectsRes, tasksRes, mentalRes, scheduleRes, studyTimeRes, productivityRes] = await Promise.all([
          subjectsApi.list(),
          tasksApi.list(),
          mentalLoadApi.list(),
          scheduleApi.list(),
          analyticsApi.studyTime(),
          analyticsApi.productivityScore()
        ]);

        setState({
          loading: false,
          error: '',
          subjects: subjectsRes.data.subjects,
          tasks: tasksRes.data.tasks,
          mentalLoads: mentalRes.data.mentalLoads,
          schedules: scheduleRes.data.schedules,
          studyTime: studyTimeRes.data,
          productivity: productivityRes.data
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || 'Unable to load dashboard'
        }));
      }
    };

    load();
  }, []);

  const upcomingTasks = state.tasks.slice(0, 4);
  const latestMentalLoad = state.mentalLoads[0];
  const schedulePreview = state.schedules.slice(0, 3);

  return (
    <AppLayout
      title="Study dashboard"
      description="A live overview of deadlines, current energy, and the next scheduled study blocks."
    >
      {state.loading ? (
        <div className="stats-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="stat-card" key={index}>
              <div className="skeleton" style={{ width: '44%' }} />
              <div className="skeleton" style={{ height: 28, marginTop: 16 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="page-grid">
          <InlineMessage type="error" message={state.error} />

          <section className="stats-grid">
            <StatCard label="Subjects" value={state.subjects.length} note="Tracked for this account" accent="blue" />
            <StatCard label="Open tasks" value={state.tasks.filter((task) => task.status === 'pending').length} note="Pending study items" accent="violet" />
            <StatCard label="Study hours" value={state.studyTime?.totalStudyHours || 0} note="Planned across saved schedule" accent="cyan" />
            <StatCard label="Productivity" value={`${state.productivity?.productivityScore || 0}%`} note="Composite score from workload + completion" accent="gold" />
          </section>

          <section className="hero-banner">
            <div className="hero-banner-copy">
              <span className="eyebrow">Weekly pulse</span>
              <h3>Build a schedule that adapts before burnout builds up.</h3>
              <p className="page-copy">
                Your latest check-ins, saved schedule, and task urgency are combined into one live planning surface.
              </p>
            </div>
            <div className="hero-banner-metrics">
              <div className="mini-kpi">
                <strong>{latestMentalLoad?.fatigueLevel || 0}/10</strong>
                <span>Current fatigue</span>
              </div>
              <div className="mini-kpi">
                <strong>{schedulePreview[0]?.tasks?.length || 0}</strong>
                <span>Tasks queued next</span>
              </div>
            </div>
          </section>

          <section className="dashboard-layout">
            <div className="panel panel-spotlight">
              <div className="section-header">
                <h3>Upcoming deadlines</h3>
                <Badge tone="accent">Urgency board</Badge>
              </div>
              {upcomingTasks.length ? (
                <div className="list">
                  {upcomingTasks.map((task) => (
                    <div className="item-card task-card-premium" key={task._id}>
                      <div className="item-head">
                        <div>
                          <h4 className="item-title">{task.title}</h4>
                          <div className="page-copy">
                            {task.subjectId?.subjectName || 'Subject unavailable'} - due in {getDaysUntil(task.deadline)} days
                          </div>
                        </div>
                        <Badge tone={task.priority >= 4 ? 'danger' : 'warning'}>P{task.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No tasks yet" description="Create a few study tasks to populate your deadline view." />
              )}
            </div>

            <div className="panel stack">
              <div className="section-header">
                <h3>Mental load summary</h3>
                <Badge tone="warning">Today</Badge>
              </div>
              {latestMentalLoad ? (
                <>
                  <FatigueRing value={latestMentalLoad.fatigueLevel} label="Latest fatigue level" />
                  <div className="item-meta">
                    <span className="badge badge-warning">Stress {latestMentalLoad.stressLevel}/10</span>
                    <span className="badge badge-success">Motivation {latestMentalLoad.motivationLevel}/10</span>
                    <span className="badge badge-accent">Sleep {latestMentalLoad.sleepHours}h</span>
                  </div>
                </>
              ) : (
                <EmptyState title="No check-in yet" description="Log today's fatigue and sleep to unlock better schedule balancing." />
              )}
            </div>
          </section>

          <section className="panel">
            <div className="section-header">
              <h3>Weekly schedule preview</h3>
              <Badge tone="violet">Next 3 days</Badge>
            </div>
            {schedulePreview.length ? (
              <div className="schedule-board">
                {schedulePreview.map((day) => (
                  <div className="day-card" key={day._id}>
                    <span className={`badge badge-${getWorkloadTone(day.workloadLevel)}`}>{day.workloadLevel}</span>
                    <h4>{formatCompactDate(day.date)}</h4>
                    <p className="page-copy">{day.totalStudyHours} planned hours</p>
                    {day.tasks.slice(0, 2).map((task) => (
                      <div key={task.taskId} className="day-task">
                        <strong>{task.title}</strong>
                        <div className="page-copy">{task.allocatedHours}h - {task.subjectName}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No saved schedule" description="Generate a weekly schedule to preview your study blocks here." />
            )}
          </section>
        </div>
      )}
    </AppLayout>
  );
}
