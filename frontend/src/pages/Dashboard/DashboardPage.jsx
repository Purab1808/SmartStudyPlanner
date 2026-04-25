import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import EmptyState from '../../components/feedback/EmptyState';
import InlineMessage from '../../components/feedback/InlineMessage';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  analyticsApi,
  mentalLoadApi,
  scheduleApi,
  subjectsApi,
  tasksApi
} from '../../services/api';
import {
  formatCompactDate,
  getRelativeDeadlineLabel,
  getWorkloadTone
} from '../../utils/formatters';

function DashboardIcon({ type }) {
  if (type === 'subjects') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6.5 9.5v5.3c0 .7.4 1.3 1 1.6 1.2.7 2.8 1.1 4.5 1.1s3.3-.4 4.5-1.1c.6-.3 1-.9 1-1.6V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'tasks') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="4.5" width="14" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'hours') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4.2l2.8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'productivity') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 17.5 10 12l3 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6.5v11h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'burnout') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4.5c2.2 2.3 4.5 4.7 4.5 8a4.5 4.5 0 1 1-9 0c0-3.3 2.3-5.7 4.5-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10.5c1.2 1.3 2.2 2.4 2.2 4a2.2 2.2 0 1 1-4.4 0c0-1.6 1-2.7 2.2-4Z" fill="currentColor" opacity=".28" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function deriveBurnoutRisk({ tasks, mentalLoads, schedules }) {
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const heavyPendingTasks = pendingTasks.filter((task) => Number(task.priority) >= 4).length;
  const averageFatigue = mentalLoads.length
    ? mentalLoads.reduce((sum, entry) => sum + Number(entry.fatigueLevel || 0), 0) / mentalLoads.length
    : 0;
  const averageSleep = mentalLoads.length
    ? mentalLoads.reduce((sum, entry) => sum + Number(entry.sleepHours || 0), 0) / mentalLoads.length
    : 0;
  const averageMotivation = mentalLoads.length
    ? mentalLoads.reduce((sum, entry) => sum + Number(entry.motivationLevel || 0), 0) / mentalLoads.length
    : 0;
  const overloadedDays = schedules.filter(
    (schedule) => schedule.workloadLevel === 'overloaded' || Number(schedule.totalStudyHours || 0) >= 8
  ).length;
  const completionRate = tasks.length
    ? Math.round((tasks.filter((task) => task.status === 'completed').length / tasks.length) * 100)
    : 0;

  const riskScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        pendingTasks.length * 6 +
          heavyPendingTasks * 10 +
          overloadedDays * 12 +
          averageFatigue * 5 +
          Math.max(0, 7 - averageSleep) * 6 +
          Math.max(0, 6 - averageMotivation) * 4
      )
    )
  );

  const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

  const trendSource = schedules.slice(0, 7);
  const trend = trendSource.map((schedule, index) => ({
    label: formatCompactDate(schedule.date) || `Day ${index + 1}`,
    value: Math.max(
      8,
      Math.min(
        92,
        Math.round(Number(schedule.totalStudyHours || 0) * 12 + Number(schedule.tasks?.length || 0) * 8)
      )
    )
  }));

  return {
    riskScore,
    riskLevel,
    modelNotes: 'Derived from open workload, recent fatigue, sleep consistency, and planned study intensity.',
    recommendation:
      riskLevel === 'high'
        ? 'Reduce heavy sessions, prioritize essential tasks, and protect recovery windows for the next few days.'
        : riskLevel === 'medium'
          ? 'Keep the schedule balanced, avoid stacking difficult tasks back-to-back, and maintain sleep consistency.'
          : 'Current workload looks manageable. Preserve momentum with shorter focused blocks and steady recovery.',
    drivers: [
      `Pending tasks: ${pendingTasks.length}`,
      `Heavy pending tasks: ${heavyPendingTasks}`,
      `Overloaded days: ${overloadedDays}`
    ],
    signals: {
      pendingTasks: pendingTasks.length,
      heavyPendingTasks,
      overloadedDays,
      averageSleep: Number(averageSleep.toFixed(1)),
      averageMotivation: Number(averageMotivation.toFixed(1)),
      completionRate
    },
    trend
  };
}

export default function DashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    subjects: [],
    tasks: [],
    mentalLoads: [],
    schedules: [],
    studyTime: null,
    productivity: null,
    burnoutRisk: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [
          subjectsRes,
          tasksRes,
          mentalRes,
          scheduleRes,
          studyTimeRes,
          productivityRes,
          burnoutRiskRes
        ] = await Promise.all([
          subjectsApi.list(),
          tasksApi.list(),
          mentalLoadApi.list(),
          scheduleApi.list(),
          analyticsApi.studyTime(),
          analyticsApi.productivityScore(),
          analyticsApi.burnoutRisk().catch(() => null)
        ]);

        const nextState = {
          loading: false,
          error: '',
          subjects: subjectsRes.data.subjects || [],
          tasks: tasksRes.data.tasks || [],
          mentalLoads: mentalRes.data.mentalLoads || [],
          schedules: scheduleRes.data.schedules || [],
          studyTime: studyTimeRes.data || null,
          productivity: productivityRes.data || null,
          burnoutRisk: burnoutRiskRes?.data || null
        };

        if (!nextState.burnoutRisk) {
          nextState.burnoutRisk = deriveBurnoutRisk(nextState);
        }

        setState(nextState);
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

  const sortedTasks = useMemo(
    () => [...state.tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [state.tasks]
  );

  const latestMentalLoad = state.mentalLoads[0];
  const recentMentalLoads = state.mentalLoads.slice(0, 6);
  const schedulePreview = state.schedules.slice(0, 3);
  const tasksQueuedNext = schedulePreview[0]?.tasks?.length || 0;
  const openTasks = state.tasks.filter((task) => task.status === 'pending').length;
  const productivityDelta = state.productivity?.completionRate
    ? Math.max(1, Math.round(state.productivity.completionRate / 10))
    : 0;
  const burnoutTone =
    state.burnoutRisk?.riskLevel === 'high'
      ? 'danger'
      : state.burnoutRisk?.riskLevel === 'medium'
        ? 'warning'
        : 'success';

  const statCards = [
    {
      label: 'Subjects',
      value: state.subjects.length,
      note: 'Tracked for this account',
      accent: 'emerald',
      icon: 'subjects',
      href: '/subjects',
      linkLabel: 'View all subjects'
    },
    {
      label: 'Open tasks',
      value: openTasks,
      note: 'Pending study items',
      accent: 'blue',
      icon: 'tasks',
      href: '/tasks',
      linkLabel: 'View tasks'
    },
    {
      label: 'Study hours',
      value: state.studyTime?.totalStudyHours || 0,
      note: 'Planned across saved schedule',
      accent: 'cyan',
      icon: 'hours',
      href: '/schedule',
      linkLabel: 'View schedule'
    },
    {
      label: 'Productivity',
      value: `${state.productivity?.productivityScore || 0}%`,
      note: 'Composite score from workload + completion',
      accent: 'emerald',
      icon: 'productivity',
      href: '/analytics',
      linkLabel: 'Open analytics',
      badge: productivityDelta ? `+${productivityDelta}% vs yesterday` : null,
      badgeTone: 'success'
    },
    {
      label: 'Burnout risk',
      value: state.burnoutRisk ? `${state.burnoutRisk.riskScore}%` : '0%',
      note: state.burnoutRisk
        ? `${state.burnoutRisk.riskLevel} predictive risk`
        : 'Predictive recovery monitor',
      accent: 'amber',
      icon: 'burnout',
      href: '/analytics',
      linkLabel: 'See risk report',
      badge: state.burnoutRisk ? `${state.burnoutRisk.riskLevel} risk` : 'No risk data',
      badgeTone: burnoutTone
    }
  ];

  const riskTrend = state.burnoutRisk?.trend?.length
    ? state.burnoutRisk.trend.slice(-7).map((item, index) => ({
        label: item.label || item.date || `Day ${index + 1}`,
        value: item.riskScore ?? item.value ?? 0
      }))
    : schedulePreview.length
      ? schedulePreview.map((schedule) => ({
          label: formatCompactDate(schedule.date),
          value: Math.min(
            100,
            Math.round(Number(schedule.totalStudyHours || 0) * 12 + Number(schedule.tasks?.length || 0) * 8)
          )
        }))
      : sortedTasks.slice(0, 7).map((task) => ({
          label: formatCompactDate(task.deadline),
          value: Math.min(100, Number(task.priority || 0) * 18)
        }));

  const insightDrivers = state.burnoutRisk?.drivers?.length
    ? state.burnoutRisk.drivers.slice(0, 3)
    : [
        'Maintain consistent sleep',
        'Spread heavy subjects across the week',
        'Use shorter revision blocks between deep work sessions'
      ];

  return (
    <AppLayout
      title="Study dashboard"
      description="A live overview of deadlines, current energy, and the next scheduled study blocks."
    >
      {state.loading ? (
        <div className="stats-grid dashboard-stats-grid">
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

          <section className="stats-grid dashboard-stats-grid">
            {statCards.map((card) => (
              <article key={card.label} className={`dashboard-stat-card dashboard-accent-${card.accent}`}>
                <div className="dashboard-stat-head">
                  <span className="dashboard-stat-icon">
                    <DashboardIcon type={card.icon} />
                  </span>
                  <div>
                    <div className="dashboard-stat-label">{card.label}</div>
                    <div className="dashboard-stat-value">{card.value}</div>
                  </div>
                </div>
                <p className="dashboard-stat-note">{card.note}</p>
                <div className="dashboard-stat-footer">
                  <Link to={card.href} className="dashboard-link">
                    {card.linkLabel} <span aria-hidden="true">-&gt;</span>
                  </Link>
                  {card.badge ? <Badge tone={card.badgeTone}>{card.badge}</Badge> : null}
                </div>
              </article>
            ))}
          </section>

          <section className="hero-banner dashboard-hero">
            <div className="hero-banner-copy dashboard-hero-copy">
              <span className="eyebrow">Weekly pulse</span>
              <h3>Build a schedule that adapts before burnout builds up.</h3>
              <p className="page-copy">
                Your latest check-ins, saved schedule, and task urgency are combined into one live planning surface.
              </p>
            </div>

            <div className="hero-banner-metrics dashboard-hero-metrics">
              <div className="mini-kpi dashboard-mini-kpi dashboard-accent-emerald">
                <div className="dashboard-mini-kpi-icon">ML</div>
                <strong>{latestMentalLoad?.fatigueLevel || 0}/10</strong>
                <span>Current fatigue</span>
              </div>
              <div className="mini-kpi dashboard-mini-kpi dashboard-accent-blue">
                <div className="dashboard-mini-kpi-icon">TK</div>
                <strong>{tasksQueuedNext}</strong>
                <span>Tasks queued next</span>
              </div>
              <div className="mini-kpi dashboard-mini-kpi dashboard-accent-amber">
                <div className="dashboard-mini-kpi-icon">BR</div>
                <strong>{state.burnoutRisk?.riskScore || 0}%</strong>
                <span>Burnout risk</span>
              </div>
            </div>
          </section>

          <section className="dashboard-layout dashboard-content-grid">
            <div className="panel panel-spotlight dashboard-panel dashboard-deadlines-panel">
              <div className="section-header">
                <h3>Upcoming deadlines</h3>
                <Badge tone="accent">Urgency board</Badge>
              </div>

              <div className="dashboard-panel-body dashboard-scroll-panel">
                {sortedTasks.length ? (
                  <div className="list dashboard-deadline-list">
                    {sortedTasks.map((task) => (
                      <article key={task._id} className="dashboard-deadline-card">
                        <div className="dashboard-deadline-visual" aria-hidden="true">
                          <span className="dashboard-calendar-top" />
                          <span className="dashboard-calendar-grid" />
                          <span className="dashboard-calendar-clock" />
                        </div>

                        <div className="dashboard-deadline-copy">
                          <div className="item-head">
                            <div>
                              <h4 className="item-title">{task.title}</h4>
                              <div className="page-copy">
                                {task.subjectId?.subjectName || 'Subject unavailable'} - {getRelativeDeadlineLabel(task.deadline)}
                              </div>
                            </div>
                            <Badge tone={task.priority >= 4 ? 'danger' : 'warning'}>P{task.priority}</Badge>
                          </div>

                          <div className="dashboard-deadline-meta">
                            <span>{formatCompactDate(task.deadline)}</span>
                            <span>{task.estimatedDuration || 0}h planned</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No tasks yet"
                    description="Create a few study tasks to populate your deadline view."
                    action={
                      <Link to="/tasks">
                        <Button>Add study task</Button>
                      </Link>
                    }
                  />
                )}
              </div>
            </div>

            <div className="panel stack dashboard-panel dashboard-mental-panel">
              <div className="section-header">
                <h3>Mental load summary</h3>
                <Badge tone="warning">Today</Badge>
              </div>

              <div className="dashboard-panel-body dashboard-scroll-panel dashboard-mental-scroll">
                {latestMentalLoad ? (
                  <>
                    <div className="dashboard-summary-empty">
                      <div className="dashboard-summary-moon" aria-hidden="true" />
                      <div className="dashboard-summary-copy">
                        <h4>{latestMentalLoad.fatigueLevel <= 4 ? 'Steady energy window' : 'Recovery check recommended'}</h4>
                        <p className="page-copy">
                          Fatigue {latestMentalLoad.fatigueLevel}/10 with {latestMentalLoad.sleepHours}h sleep logged today.
                        </p>
                      </div>
                    </div>

                    <div className="item-meta dashboard-mental-badges">
                      <span className="badge badge-warning">Estimated stress {latestMentalLoad.stressLevel}/10</span>
                      <span className="badge badge-success">Estimated motivation {latestMentalLoad.motivationLevel}/10</span>
                      <span className="badge badge-accent">Sleep {latestMentalLoad.sleepHours}h</span>
                    </div>

                    {recentMentalLoads.length > 1 ? (
                      <div className="dashboard-mental-history">
                        {recentMentalLoads.slice(1).map((entry) => (
                          <div key={entry._id} className="dashboard-mental-history-item">
                            <span>Fatigue {entry.fatigueLevel}/10</span>
                            <span>Sleep {entry.sleepHours}h</span>
                            <span>Stress {entry.stressLevel}/10</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <Link to="/mental-load" className="dashboard-link">
                      Open check-ins
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    title="No check-in yet"
                    description="Log today's fatigue and sleep to unlock better schedule balancing."
                    action={
                      <Link to="/mental-load">
                        <Button>Check-in now</Button>
                      </Link>
                    }
                  />
                )}
              </div>
            </div>
          </section>

          <section className="panel dashboard-panel dashboard-monitor-panel">
            <div className="section-header">
              <div>
                <h3>Predictive burnout monitor</h3>
                <p className="page-copy dashboard-section-copy">
                  {state.burnoutRisk?.modelNotes ||
                    'AI-predicted burnout risk trend based on your workload, sleep, and recoverability.'}
                </p>
              </div>
              <div className="dashboard-monitor-actions">
                <Badge tone="muted">7 days</Badge>
                <Badge tone={burnoutTone}>{state.burnoutRisk?.riskLevel || 'low'} risk</Badge>
              </div>
            </div>

            <div className="dashboard-monitor-grid">
              <div className="dashboard-chart-shell">
                <div className="dashboard-chart">
                  <div className="dashboard-chart-axis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  <div className="dashboard-chart-plot">
                    {riskTrend.length ? (
                      <>
                        <div
                          className="dashboard-chart-area"
                          style={{
                            clipPath: `polygon(0% 100%, ${riskTrend
                              .map((point, index) => {
                                const left = riskTrend.length === 1 ? 50 : (index / (riskTrend.length - 1)) * 100;
                                const top = 100 - Math.max(8, Math.min(92, point.value));
                                return `${left}% ${top}%`;
                              })
                              .join(', ')}, 100% 100%)`
                          }}
                        />
                        <div className="dashboard-chart-line">
                          {riskTrend.map((point, index) => {
                            const left = riskTrend.length === 1 ? 50 : (index / (riskTrend.length - 1)) * 100;
                            const top = 100 - Math.max(8, Math.min(92, point.value));

                            return (
                              <div
                                key={`${point.label}-${index}`}
                                className="dashboard-chart-point"
                                style={{ left: `${left}%`, top: `${top}%` }}
                              >
                                <span>{point.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="dashboard-chart-empty">Not enough history yet</div>
                    )}
                  </div>
                </div>
              </div>

              <aside className="dashboard-insights-card">
                <div className="dashboard-insights-header">
                  <h4>Insights</h4>
                  <Badge tone={burnoutTone}>{state.burnoutRisk ? `${state.burnoutRisk.riskScore}%` : '0%'}</Badge>
                </div>

                <p className="page-copy">
                  {state.burnoutRisk?.recommendation ||
                    'Your next few entries will unlock more precise recovery guidance.'}
                </p>

                <div className="dashboard-insight-list">
                  {insightDrivers.map((driver) => (
                    <div key={driver} className="dashboard-insight-item">
                      <span className="dashboard-insight-bullet" aria-hidden="true" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <section className="panel dashboard-panel">
            <div className="section-header">
              <h3>Weekly schedule preview</h3>
              <Badge tone="violet">Next 3 days</Badge>
            </div>

            {schedulePreview.length ? (
              <div className="schedule-board">
                {schedulePreview.map((day) => (
                  <div key={day._id} className="day-card">
                    <span className={`badge badge-${getWorkloadTone(day.workloadLevel)}`}>{day.workloadLevel}</span>
                    <h4>{formatCompactDate(day.date)}</h4>
                    <p className="page-copy">{day.totalStudyHours} planned hours</p>
                    {day.tasks.slice(0, 2).map((task) => (
                      <div key={task.taskId} className="day-task">
                        <strong>{task.title}</strong>
                        <div className="page-copy">
                          {task.allocatedHours}h - {task.subjectName}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved schedule"
                description="Generate a weekly schedule to preview your study blocks here."
                action={
                  <Link to="/schedule">
                    <Button>View planner</Button>
                  </Link>
                }
              />
            )}
          </section>
        </div>
      )}
    </AppLayout>
  );
}
