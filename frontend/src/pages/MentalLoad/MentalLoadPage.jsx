import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FormField from '../../components/forms/FormField';
import EmptyState from '../../components/feedback/EmptyState';
import InlineMessage from '../../components/feedback/InlineMessage';
import FatigueRing from '../../components/visuals/FatigueRing';
import { mentalLoadApi } from '../../services/api';
import { formatDate } from '../../utils/formatters';

const today = new Date().toISOString().slice(0, 10);

const initialForm = {
  fatigueLevel: 5,
  stressLevel: 5,
  motivationLevel: 5,
  sleepHours: 7,
  date: today
};

export default function MentalLoadPage() {
  const [form, setForm] = useState(initialForm);
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const { data } = await mentalLoadApi.list();
      setEntries(data.mentalLoads);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch mental-load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await mentalLoadApi.createOrUpdate({
        ...form,
        fatigueLevel: Number(form.fatigueLevel),
        stressLevel: Number(form.stressLevel),
        motivationLevel: Number(form.motivationLevel),
        sleepHours: Number(form.sleepHours)
      });
      setMessage('Mental load saved for the selected date.');
      loadEntries();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save mental load');
    }
  };

  const latest = entries[0];

  return (
    <AppLayout
      title="Mental load tracker"
      description="Record daily fatigue, stress, motivation, and sleep so scheduling can adapt to your cognitive bandwidth."
    >
      <div className="two-col">
        <section className="panel">
          <div className="section-header">
            <h3>Daily check-in</h3>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field full">
              <InlineMessage type="success" message={message} />
              <InlineMessage type="error" message={error} />
            </div>
            <FormField label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
            <FormField label="Sleep hours" name="sleepHours" type="number" min="0" max="24" step="0.5" value={form.sleepHours} onChange={handleChange} />
            <FormField label="Fatigue level" name="fatigueLevel" type="range" min="1" max="10" value={form.fatigueLevel} onChange={handleChange} />
            <FormField label="Stress level" name="stressLevel" type="range" min="1" max="10" value={form.stressLevel} onChange={handleChange} />
            <FormField label="Motivation level" name="motivationLevel" type="range" min="1" max="10" value={form.motivationLevel} onChange={handleChange} full />
            <div className="field full actions-inline">
              <button className="btn btn-primary" type="submit">
                Save today&apos;s entry
              </button>
            </div>
          </form>
        </section>

        <section className="panel stack">
          <div className="section-header">
            <h3>Latest state</h3>
          </div>
          {latest ? (
            <>
              <FatigueRing value={latest.fatigueLevel} label={`Logged on ${formatDate(latest.date)}`} />
              <div className="item-meta">
                <span className="badge badge-warning">Stress {latest.stressLevel}/10</span>
                <span className="badge badge-success">Motivation {latest.motivationLevel}/10</span>
                <span className="badge badge-accent">Sleep {latest.sleepHours}h</span>
              </div>
            </>
          ) : (
            <EmptyState title="No check-ins yet" description="Submit your first mental-load entry to unlock smarter study balancing." />
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="section-header">
          <h3>Check-in history</h3>
        </div>
        {loading ? (
          <div className="stack">
            <div className="skeleton" style={{ height: 88 }} />
            <div className="skeleton" style={{ height: 88 }} />
          </div>
        ) : entries.length ? (
          <div className="list">
            {entries.map((entry) => (
              <div className="item-card" key={entry._id}>
                <div className="item-head">
                  <div>
                    <h4 className="item-title">{formatDate(entry.date)}</h4>
                    <div className="page-copy">Recorded daily mental and sleep status.</div>
                  </div>
                </div>
                <div className="item-meta">
                  <span className="badge badge-warning">Fatigue {entry.fatigueLevel}</span>
                  <span className="badge badge-danger">Stress {entry.stressLevel}</span>
                  <span className="badge badge-success">Motivation {entry.motivationLevel}</span>
                  <span className="badge badge-accent">Sleep {entry.sleepHours}h</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No saved entries" description="Your recent mental-load check-ins will appear here." />
        )}
      </section>
    </AppLayout>
  );
}
