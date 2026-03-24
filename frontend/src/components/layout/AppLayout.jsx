import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { subjectsApi, tasksApi } from '../../services/api';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import FormField from '../forms/FormField';
import InlineMessage from '../feedback/InlineMessage';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'DB', hint: 'Overview' },
  { to: '/subjects', label: 'Subjects', icon: 'SB', hint: 'Courses' },
  { to: '/tasks', label: 'Tasks', icon: 'TK', hint: 'Sessions' },
  { to: '/mental-load', label: 'Mental Load', icon: 'ML', hint: 'Check-ins' },
  { to: '/schedule', label: 'Schedule', icon: 'SC', hint: 'Planner' },
  { to: '/analytics', label: 'Analytics', icon: 'AN', hint: 'Insights' }
];

const getApiError = (error, fallback) =>
  error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || fallback;

export default function AppLayout({ title, description, actions, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [quickOpen, setQuickOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [quickTask, setQuickTask] = useState({
    title: '',
    subjectId: '',
    estimatedDuration: 1,
    difficultyLevel: 3,
    deadline: '',
    priority: 3
  });
  const [quickMessage, setQuickMessage] = useState('');
  const [quickError, setQuickError] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          setQuickOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!quickOpen) return;

    subjectsApi
      .list()
      .then(({ data }) => {
        setSubjects(data.subjects);
        setQuickTask((prev) => ({
          ...prev,
          subjectId: prev.subjectId || data.subjects[0]?._id || ''
        }));
      })
      .catch(() => {
        setQuickError('Unable to load subjects for quick task creation.');
      });
  }, [quickOpen]);

  const currentNav = useMemo(
    () => navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0],
    [location.pathname]
  );

  const handleQuickChange = (event) => {
    setQuickTask((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submitQuickTask = async (event) => {
    event.preventDefault();
    setQuickError('');
    setQuickMessage('');

    try {
      await tasksApi.create({
        ...quickTask,
        estimatedDuration: Number(quickTask.estimatedDuration),
        difficultyLevel: Number(quickTask.difficultyLevel),
        priority: Number(quickTask.priority)
      });
      setQuickMessage('Task created successfully.');
      setQuickTask({
        title: '',
        subjectId: subjects[0]?._id || '',
        estimatedDuration: 1,
        difficultyLevel: 3,
        deadline: '',
        priority: 3
      });
    } catch (error) {
      setQuickError(getApiError(error, 'Unable to create task.'));
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand brand-premium">
          <div className="brand-badge brand-badge-signalbook" aria-hidden="true">
            <span className="brand-page brand-page-left" />
            <span className="brand-page brand-page-right" />
            <span className="brand-spine" />
            <span className="brand-signal seg-a" />
            <span className="brand-signal seg-b" />
            <span className="brand-signal seg-c" />
            <span className="brand-signal seg-d" />
          </div>
          <div className="brand-copy">
            <h1>Smart Study Planner</h1>
            <p>Adaptive focus system for balanced study cycles</p>
          </div>
        </div>

        <div className="sidebar-panel sidebar-panel-pulse">
          <span className="eyebrow">Current mode</span>
          <h3>{currentNav.label}</h3>
          <p className="sidebar-note">
            {currentNav.hint}. Press <strong>N</strong> for a quick task capture.
          </p>
          <div className="pulse-meter">
            <span className="pulse-meter-bar pulse-meter-bar-a" />
            <span className="pulse-meter-bar pulse-meter-bar-b" />
            <span className="pulse-meter-bar pulse-meter-bar-c" />
            <span className="pulse-meter-bar pulse-meter-bar-d" />
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-copy">
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{(user?.name || 'S').slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{user?.name || 'Student'}</strong>
              <div className="muted">{user?.course || 'Planner account'}</div>
            </div>
          </div>
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </aside>

      <main className="shell-main">
        <header className="topbar">
          <div className="topbar-copy">
            <span className="eyebrow">Academic cockpit</span>
            <h2>{title}</h2>
            <p className="page-copy">{description}</p>
          </div>
          <div className="topbar-tools">
            <div className="topbar-chip">
              <span className="topbar-dot" />
              <span>Focus mode active</span>
            </div>
            <button className="icon-btn" type="button" aria-label="Notifications">
              3
            </button>
            <Button onClick={() => setQuickOpen(true)}>Quick add task</Button>
            {actions ? <div className="actions-inline">{actions}</div> : null}
          </div>
        </header>
        {children}
      </main>

      <Modal
        open={quickOpen}
        title="Create a task from anywhere"
        subtitle="Fast capture for study sessions, revision blocks, or exam prep."
        onClose={() => setQuickOpen(false)}
        footer={
          <div className="actions-inline">
            <Button variant="secondary" onClick={() => setQuickOpen(false)}>
              Close
            </Button>
            <Button onClick={submitQuickTask}>Save task</Button>
          </div>
        }
      >
        <form className="form-grid" onSubmit={submitQuickTask}>
          <div className="field full">
            <InlineMessage type="success" message={quickMessage} />
            <InlineMessage type="error" message={quickError} />
          </div>
          <FormField
            label="Task title"
            name="title"
            value={quickTask.title}
            onChange={handleQuickChange}
            helperText="Required"
            required
          />
          <FormField
            label="Subject"
            name="subjectId"
            value={quickTask.subjectId}
            onChange={handleQuickChange}
            helperText="Choose one of your existing subjects"
            required
            options={subjects.length ? subjects.map((subject) => ({ value: subject._id, label: subject.subjectName })) : [{ value: '', label: 'No subjects available' }]}
          />
          <FormField
            label="Duration"
            name="estimatedDuration"
            type="number"
            min="0.25"
            max="24"
            step="0.25"
            value={quickTask.estimatedDuration}
            onChange={handleQuickChange}
            helperText="Allowed range: 0.25 to 24 hours"
            required
          />
          <FormField
            label="Deadline"
            name="deadline"
            type="date"
            value={quickTask.deadline}
            onChange={handleQuickChange}
            helperText="Required"
            required
          />
          <FormField
            label="Difficulty"
            name="difficultyLevel"
            type="number"
            min="1"
            max="5"
            value={quickTask.difficultyLevel}
            onChange={handleQuickChange}
            helperText="Allowed range: 1 to 5"
            required
          />
          <FormField
            label="Priority"
            name="priority"
            type="number"
            min="1"
            max="5"
            value={quickTask.priority}
            onChange={handleQuickChange}
            helperText="Allowed range: 1 to 5"
            required
          />
        </form>
      </Modal>
    </div>
  );
}
