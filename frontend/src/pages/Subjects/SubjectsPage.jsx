import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FormField from '../../components/forms/FormField';
import InlineMessage from '../../components/feedback/InlineMessage';
import EmptyState from '../../components/feedback/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { subjectsApi } from '../../services/api';
import { formatDate, getDaysUntil, getDifficultyLabel } from '../../utils/formatters';

const emptyForm = {
  subjectName: '',
  difficultyLevel: 3,
  priority: 3,
  estimatedHours: 10,
  examDate: ''
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const { data } = await subjectsApi.list();
      setSubjects(data.subjects);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        difficultyLevel: Number(form.difficultyLevel),
        priority: Number(form.priority),
        estimatedHours: Number(form.estimatedHours)
      };

      if (editingId) {
        await subjectsApi.update(editingId, payload);
        setMessage('Subject updated.');
      } else {
        await subjectsApi.create(payload);
        setMessage('Subject added.');
      }
      resetForm();
      loadSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setForm({
      subjectName: subject.subjectName,
      difficultyLevel: subject.difficultyLevel,
      priority: subject.priority,
      estimatedHours: subject.estimatedHours,
      examDate: subject.examDate?.slice(0, 10)
    });
  };

  const handleDelete = async (id) => {
    try {
      await subjectsApi.remove(id);
      setMessage('Subject deleted.');
      loadSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete subject');
    }
  };

  return (
    <AppLayout
      title="Subjects"
      description="Capture each course, its difficulty, and the exam horizon that should shape your plan."
    >
      <div className="two-col dashboard-page-grid">
        <section className="panel dashboard-panel dashboard-form-panel">
          <div className="section-header">
            <h3>{editingId ? 'Edit subject' : 'Add subject'}</h3>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field full">
              <InlineMessage type="success" message={message} />
              <InlineMessage type="error" message={error} />
            </div>
            <FormField label="Subject name" name="subjectName" value={form.subjectName} onChange={handleChange} />
            <FormField label="Exam date" name="examDate" type="date" value={form.examDate} onChange={handleChange} />
            <FormField label="Difficulty" name="difficultyLevel" type="number" min="1" max="5" value={form.difficultyLevel} onChange={handleChange} />
            <FormField label="Priority" name="priority" type="number" min="1" max="5" value={form.priority} onChange={handleChange} />
            <FormField label="Estimated hours" name="estimatedHours" type="number" min="0.5" step="0.5" value={form.estimatedHours} onChange={handleChange} full />
            <div className="field full actions-inline">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update subject' : 'Create subject'}
              </Button>
              {editingId ? (
                <Button variant="secondary" type="button" onClick={resetForm}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel dashboard-panel dashboard-list-panel">
          <div className="section-header">
            <h3>Current subjects</h3>
          </div>
          {loading ? (
            <div className="stack">
              <div className="skeleton" style={{ height: 88 }} />
              <div className="skeleton" style={{ height: 88 }} />
            </div>
          ) : subjects.length ? (
            <div className="list dashboard-record-list">
              {subjects.map((subject) => (
                <div className="item-card subject-card-premium dashboard-record-card" key={subject._id}>
                  <div className="item-head">
                    <div>
                      <h4 className="item-title">{subject.subjectName}</h4>
                      <div className="page-copy">
                        Exam on {formatDate(subject.examDate)} - {getDaysUntil(subject.examDate)} days left
                      </div>
                    </div>
                    <div className="actions-inline">
                      <Button variant="secondary" type="button" onClick={() => handleEdit(subject)}>
                        Edit
                      </Button>
                      <Button variant="danger" type="button" onClick={() => handleDelete(subject._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="item-meta">
                    <Badge tone="accent">{getDifficultyLabel(subject.difficultyLevel)}</Badge>
                    <Badge tone="warning">Priority {subject.priority}</Badge>
                    <Badge tone="muted">{subject.estimatedHours} hours planned</Badge>
                  </div>
                  <div className="dashboard-record-progress">
                    <ProgressBar value={subject.difficultyLevel} max={5} tone="violet" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No subjects yet" description="Add your first subject to begin planning study work by course." />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
