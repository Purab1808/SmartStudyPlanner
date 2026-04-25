import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FormField from '../../components/forms/FormField';
import InlineMessage from '../../components/feedback/InlineMessage';
import EmptyState from '../../components/feedback/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { subjectsApi, tasksApi } from '../../services/api';
import { formatDate, getDaysUntil, getPriorityTone } from '../../utils/formatters';

const emptyTask = {
  title: '',
  subjectId: '',
  estimatedDuration: 1,
  difficultyLevel: 3,
  deadline: '',
  priority: 3,
  status: 'pending'
};

const getApiError = (err, fallback) =>
  err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || fallback;

export default function TasksPage() {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [subjectsRes, tasksRes] = await Promise.all([subjectsApi.list(), tasksApi.list()]);
      setSubjects(subjectsRes.data.subjects);
      setTasks(tasksRes.data.tasks);
      setError('');
    } catch (err) {
      setError(getApiError(err, 'Unable to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!form.subjectId && subjects[0]?._id) {
      setForm((prev) => ({ ...prev, subjectId: subjects[0]._id }));
    }
  }, [subjects, form.subjectId]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setEditingId('');
    setForm((prev) => ({ ...emptyTask, subjectId: subjects[0]?._id || '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        ...form,
        estimatedDuration: Number(form.estimatedDuration),
        difficultyLevel: Number(form.difficultyLevel),
        priority: Number(form.priority)
      };

      if (editingId) {
        await tasksApi.update(editingId, payload);
        setMessage('Task updated.');
      } else {
        await tasksApi.create(payload);
        setMessage('Task created.');
      }

      resetForm();
      load();
    } catch (err) {
      setError(getApiError(err, 'Unable to save task'));
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      subjectId: task.subjectId?._id || task.subjectId,
      estimatedDuration: task.estimatedDuration,
      difficultyLevel: task.difficultyLevel,
      deadline: task.deadline?.slice(0, 10),
      priority: task.priority,
      status: task.status
    });
  };

  const handleDelete = async (id) => {
    try {
      await tasksApi.remove(id);
      setMessage('Task deleted.');
      load();
    } catch (err) {
      setError(getApiError(err, 'Unable to delete task'));
    }
  };

  const handleComplete = async (id) => {
    try {
      await tasksApi.complete(id);
      setMessage('Task marked complete.');
      load();
    } catch (err) {
      setError(getApiError(err, 'Unable to mark task complete'));
    }
  };

  const filteredTasks = tasks.filter((task) => filter === 'all' || (task.subjectId?._id || task.subjectId) === filter);

  return (
    <AppLayout
      title="Tasks"
      description="Create focused study sessions, adjust priorities, and mark completed work as momentum builds."
    >
      <div className="page-grid dashboard-page-grid">
        <section className="panel dashboard-panel dashboard-form-panel">
          <div className="section-header">
            <h3>{editingId ? 'Edit task' : 'Add task'}</h3>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field full">
              <InlineMessage type="success" message={message} />
              <InlineMessage type="error" message={error} />
            </div>
            <FormField
              label="Task title"
              name="title"
              value={form.title}
              onChange={handleChange}
              helperText="Required"
              required
            />
            <FormField
              label="Subject"
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              helperText="Choose one of your saved subjects"
              required
              options={subjects.map((subject) => ({ value: subject._id, label: subject.subjectName }))}
            />
            <FormField
              label="Duration (hours)"
              name="estimatedDuration"
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              value={form.estimatedDuration}
              onChange={handleChange}
              helperText="Allowed range: 0.25 to 24 hours"
              required
            />
            <FormField
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              helperText="Required"
              required
            />
            <FormField
              label="Difficulty"
              name="difficultyLevel"
              type="number"
              min="1"
              max="5"
              value={form.difficultyLevel}
              onChange={handleChange}
              helperText="Allowed range: 1 to 5"
              required
            />
            <FormField
              label="Priority"
              name="priority"
              type="number"
              min="1"
              max="5"
              value={form.priority}
              onChange={handleChange}
              helperText="Allowed range: 1 to 5"
              required
            />
            <div className="field full actions-inline">
              <Button type="submit">{editingId ? 'Update task' : 'Create task'}</Button>
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
            <h3>Task list</h3>
            <div style={{ minWidth: 220 }}>
              <FormField
                label="Filter by subject"
                name="taskFilter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                options={[
                  { value: 'all', label: 'All subjects' },
                  ...subjects.map((subject) => ({ value: subject._id, label: subject.subjectName }))
                ]}
              />
            </div>
          </div>

          {loading ? (
            <div className="stack">
              <div className="skeleton" style={{ height: 96 }} />
              <div className="skeleton" style={{ height: 96 }} />
            </div>
          ) : filteredTasks.length ? (
            <div className="list dashboard-record-list">
              {filteredTasks.map((task) => (
                <div
                  className={`item-card task-card-premium dashboard-record-card ${task.status === 'completed' ? 'task-complete' : ''}`}
                  key={task._id}
                >
                  <div className="item-head">
                    <div>
                      <h4 className="item-title">{task.title}</h4>
                      <div className="page-copy">
                        {task.subjectId?.subjectName || 'Subject'} - due {formatDate(task.deadline)} - {getDaysUntil(task.deadline)} days left
                      </div>
                    </div>
                    <div className="actions-inline">
                      {task.status !== 'completed' ? (
                        <Button type="button" onClick={() => handleComplete(task._id)}>
                          Complete
                        </Button>
                      ) : null}
                      <Button variant="secondary" type="button" onClick={() => handleEdit(task)}>
                        Edit
                      </Button>
                      <Button variant="danger" type="button" onClick={() => handleDelete(task._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="item-meta">
                    <Badge tone={task.status === 'completed' ? 'success' : 'muted'}>{task.status}</Badge>
                    <Badge tone={getPriorityTone(task.priority)}>Priority {task.priority}</Badge>
                    <Badge tone="accent">{task.estimatedDuration}h</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No tasks match this filter" description="Create tasks or change the active subject filter." />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
