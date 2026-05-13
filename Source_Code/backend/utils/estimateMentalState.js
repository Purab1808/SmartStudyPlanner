const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const roundToTenth = (value) => Math.round(value * 10) / 10;

const estimateMentalState = ({
  fatigueLevel,
  sleepHours,
  pendingTasks,
  overdueTasks,
  heavyPendingTasks,
  completedRecently,
  overloadedDays
}) => {
  const stressRaw =
    2 +
    fatigueLevel * 0.28 +
    Math.max(0, 7 - sleepHours) * 0.45 +
    pendingTasks * 0.18 +
    overdueTasks * 0.65 +
    heavyPendingTasks * 0.32 +
    overloadedDays * 0.42 -
    completedRecently * 0.12;

  const motivationRaw =
    7.6 -
    fatigueLevel * 0.22 +
    Math.min(sleepHours, 8) * 0.18 -
    pendingTasks * 0.08 -
    overdueTasks * 0.32 -
    heavyPendingTasks * 0.14 -
    overloadedDays * 0.18 +
    completedRecently * 0.24;

  return {
    stressLevel: roundToTenth(clamp(stressRaw, 1, 10)),
    motivationLevel: roundToTenth(clamp(motivationRaw, 1, 10))
  };
};

module.exports = {
  estimateMentalState
};
