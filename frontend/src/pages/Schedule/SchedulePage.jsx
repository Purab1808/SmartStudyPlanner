import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FormField from '../../components/forms/FormField';
import EmptyState from '../../components/feedback/EmptyState';
import InlineMessage from '../../components/feedback/InlineMessage';
import { scheduleApi } from '../../services/api';
import { formatCompactDate, getWorkloadTone } from '../../utils/formatters';

const initialForm = {
  startDate: new Date().toISOString().slice(0, 10),
  days: 7,
  availableDailyTime: 5
};

export default function SchedulePage() {
  const [generator, setGenerator] = useState(initialForm);
  const [schedules, setSchedules] = useState([]);
  const [overload, setOverload] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [scheduleRes, overloadRes] = await Promise.all([scheduleApi.list(), scheduleApi.overloadCheck()]);
      setSchedules(scheduleRes.data.schedules);
      setOverload(overloadRes.data.analysis);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    setGenerator((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await scheduleApi.generate({
        startDate: generator.startDate,
        days: Number(generator.days),
        availableDailyTime: Number(generator.availableDailyTime)
      });
      setMessage('A fresh weekly schedule has been generated.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to generate schedule');
    }
  };

  const clearSchedules = async () => {
    try {
      await scheduleApi.clear();
      setMessage('Stored schedules cleared.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to clear schedules');
    }
  };

  return (
    <AppLayout
      title="Smart schedule"
      description="Generate a weekly plan that balances urgency, subject difficulty, and your recent mental-load check-ins."
      actions={[
        <button key="clear" className="btn btn-danger" type="button" onClick={clearSchedules}>
          Clear schedules
        </button>
      ]}
    >
      <div className="page-grid dashboard-page-grid">
        <section className="panel dashboard-panel dashboard-form-panel">
          <div className="section-header">
            <h3>Generate weekly study plan</h3>
          </div>
          <form className="form-grid" onSubmit={handleGenerate}>
            <div className="field full">
              <InlineMessage type="success" message={message} />
              <InlineMessage type="error" message={error} />
            </div>
            <FormField label="Start date" name="startDate" type="date" value={generator.startDate} onChange={handleChange} />
            <FormField label="Planning days" name="days" type="number" min="1" max="14" value={generator.days} onChange={handleChange} />
            <FormField
              label="Daily study time"
              name="availableDailyTime"
              type="number"
              min="1"
              max="16"
              step="0.5"
              value={generator.availableDailyTime}
              onChange={handleChange}
              full
            />
            <div className="field full">
              <button className="btn btn-primary" type="submit">Generate schedule</button>
            </div>
          </form>
        </section>

        <section className="panel dashboard-panel dashboard-list-panel">
          <div className="section-header">
            <h3>Overload warnings</h3>
          </div>
          {overload.length ? (
            <div className="list dashboard-record-list">
              {overload.map((day) => (
                <div className="item-card dashboard-record-card" key={String(day.date)}>
                  <div className="item-head">
                    <div>
                      <h4 className="item-title">{formatCompactDate(day.date)}</h4>
                      <div className="page-copy">
                        {day.totalStudyHours}h planned - fatigue prediction {day.fatiguePrediction}
                      </div>
                    </div>
                    <span className={`badge badge-${day.overloaded ? 'danger' : 'success'}`}>
                      {day.overloaded ? 'Overloaded' : 'Stable'}
                    </span>
                  </div>
                  <div className="item-meta">
                    {day.suggestions.map((suggestion) => (
                      <span className="badge badge-muted" key={suggestion}>{suggestion}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No overload analysis yet" description="Generate or fetch schedules to evaluate overload patterns." />
          )}
        </section>

        <section className="panel dashboard-panel dashboard-list-panel">
          <div className="section-header">
            <h3>Weekly planner</h3>
          </div>
          {loading ? (
            <div className="stack">
              <div className="skeleton" style={{ height: 104 }} />
              <div className="skeleton" style={{ height: 104 }} />
            </div>
          ) : schedules.length ? (
            <div className="schedule-board">
              {schedules.map((schedule) => (
                <div className="day-card" key={schedule._id}>
                  <span className={`badge badge-${getWorkloadTone(schedule.workloadLevel)}`}>{schedule.workloadLevel}</span>
                  <h4>{formatCompactDate(schedule.date)}</h4>
                  <p className="page-copy">
                    {schedule.totalStudyHours}h - fatigue prediction {schedule.fatiguePrediction}
                  </p>
                  {schedule.tasks.length ? (
                    schedule.tasks.map((task) => (
                      <div className="day-task" key={task.taskId}>
                        <strong>{task.title}</strong>
                        <div className="page-copy">{task.subjectName} - {task.allocatedHours}h</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ padding: 18 }}>Recovery or buffer day.</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No schedule generated" description="Use the generator above to create your first weekly study plan." />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
