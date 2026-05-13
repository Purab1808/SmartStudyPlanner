export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

export const formatCompactDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-';

export const getDaysUntil = (value) => {
  if (!value) return null;
  const today = new Date();
  const target = new Date(value);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const getRelativeDeadlineLabel = (value) => {
  const days = getDaysUntil(value);
  if (days === null) return 'No deadline';
  if (days === 0) return 'due today';
  if (days === 1) return 'due tomorrow';
  if (days > 1) return `due in ${days} days`;
  if (days === -1) return 'overdue by 1 day';
  return `overdue by ${Math.abs(days)} days`;
};

export const clampPercent = (value, max = 10) => Math.max(0, Math.min(100, Math.round((value / max) * 100)));

export const getPriorityTone = (priority) => {
  if (priority >= 5) return 'danger';
  if (priority >= 3) return 'warning';
  return 'accent';
};

export const getWorkloadTone = (level) => {
  if (level === 'overloaded') return 'danger';
  if (level === 'heavy') return 'warning';
  if (level === 'balanced') return 'accent';
  return 'success';
};

export const getDifficultyLabel = (value) => ['Very Light', 'Light', 'Moderate', 'Challenging', 'Intense'][value - 1] || 'Unknown';
