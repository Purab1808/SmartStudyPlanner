const { addDays, getStartOfDay } = require('./date');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getFatigueCapacityMultiplier = (fatigueLevel) => {
  if (fatigueLevel >= 8) return 0.55;
  if (fatigueLevel >= 6) return 0.75;
  if (fatigueLevel <= 3) return 1.15;
  return 1;
};

const getTaskIntensityLabel = (task) => {
  const intensityScore = task.difficultyLevel * task.estimatedDuration;
  if (intensityScore >= 8) return 'heavy';
  if (intensityScore >= 4) return 'medium';
  return 'light';
};

const getPriorityScore = (task, subject, currentDate) => {
  const now = getStartOfDay(currentDate);
  const deadline = getStartOfDay(task.deadline);
  const millisUntilDeadline = Math.max(deadline - now, 0);
  const daysUntilDeadline = Math.max(Math.ceil(millisUntilDeadline / (1000 * 60 * 60 * 24)), 1);
  const deadlineUrgency = 10 / daysUntilDeadline;
  const subjectWeight = subject ? subject.priority * 1.4 : 0;
  const difficultyWeight = task.difficultyLevel * 1.2;
  const durationWeight = task.estimatedDuration * 0.8;
  const completionBias = task.status === 'completed' ? -100 : 0;

  return Number(
    (
      deadlineUrgency +
      subjectWeight +
      difficultyWeight +
      durationWeight +
      task.priority * 1.6 +
      completionBias
    ).toFixed(2)
  );
};

const getWorkloadLevel = (hours, limit, fatiguePrediction) => {
  if (hours > limit || fatiguePrediction >= 8) return 'overloaded';
  if (hours >= limit * 0.85 || fatiguePrediction >= 6.5) return 'heavy';
  if (hours >= limit * 0.5) return 'balanced';
  return 'light';
};

const buildSuggestion = (dayPlan) => {
  if (dayPlan.workloadLevel === 'overloaded') {
    return 'Shift one high-effort task to the next available low-load day and protect a recovery block.';
  }
  if (dayPlan.workloadLevel === 'heavy') {
    return 'Use Pomodoro blocks and add a longer break after the most demanding task.';
  }
  if (dayPlan.mentalLoad.fatigueLevel <= 3) {
    return 'This is a good day for deep work. Start with the hardest task first.';
  }
  return 'Maintain steady progress with short review sessions and one focused task block.';
};

const generateSchedule = ({
  tasks,
  subjectsById,
  mentalLoadsByDate,
  startDate = new Date(),
  days = 7,
  availableDailyTime = 6,
  studyPreferences = {}
}) => {
  const pendingTasks = tasks
    .filter((task) => task.status === 'pending')
    .map((task) => ({
      ...task.toObject(),
      priorityScore: getPriorityScore(task, subjectsById[task.subjectId.toString()], startDate)
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const plans = [];

  for (let offset = 0; offset < days; offset += 1) {
    const dayDate = getStartOfDay(addDays(startDate, offset));
    const dayKey = dayDate.toISOString().slice(0, 10);
    const mentalLoad = mentalLoadsByDate[dayKey] || {
      fatigueLevel: 5,
      stressLevel: 5,
      motivationLevel: 5,
      sleepHours: 7
    };
    const capacityMultiplier = getFatigueCapacityMultiplier(mentalLoad.fatigueLevel);
    const dailyLimit = clamp(availableDailyTime * capacityMultiplier, 1, 16);
    const selectedTasks = [];
    let allocatedHours = 0;
    let heavyTaskCount = 0;

    for (const task of pendingTasks) {
      if (task._scheduled) continue;

      const taskIntensity = getTaskIntensityLabel(task);
      const canTakeHeavyTask = mentalLoad.fatigueLevel <= 5 || heavyTaskCount === 0;
      const fitsToday = allocatedHours + task.estimatedDuration <= dailyLimit;
      const deadlineNear = new Date(task.deadline) <= addDays(dayDate, 2);

      if (!fitsToday && !deadlineNear) continue;
      if (taskIntensity === 'heavy' && !canTakeHeavyTask) continue;
      if (mentalLoad.fatigueLevel >= 8 && taskIntensity === 'heavy') continue;

      selectedTasks.push({
        taskId: task._id,
        title: task.title,
        subjectId: task.subjectId,
        subjectName: subjectsById[task.subjectId.toString()]?.subjectName || 'Unknown Subject',
        allocatedHours: Number(task.estimatedDuration.toFixed(2)),
        priorityScore: task.priorityScore,
        taskDifficulty: task.difficultyLevel,
        suggestedStartWindow: studyPreferences.preferredStudyWindow || 'flexible'
      });

      allocatedHours += task.estimatedDuration;
      heavyTaskCount += taskIntensity === 'heavy' ? 1 : 0;
      task._scheduled = true;

      if (allocatedHours >= dailyLimit - 0.25) {
        break;
      }
    }

    const fatiguePrediction = clamp(
      mentalLoad.fatigueLevel + allocatedHours / 2 + (mentalLoad.stressLevel - mentalLoad.motivationLevel) / 4,
      1,
      10
    );

    const workloadLevel = getWorkloadLevel(allocatedHours, availableDailyTime, fatiguePrediction);

    plans.push({
      date: dayDate,
      tasks: selectedTasks,
      totalStudyHours: Number(allocatedHours.toFixed(2)),
      fatiguePrediction: Number(fatiguePrediction.toFixed(1)),
      workloadLevel,
      overloadReason:
        allocatedHours > availableDailyTime
          ? 'Allocated study time exceeds preferred daily study limit.'
          : mentalLoad.fatigueLevel >= 8
            ? 'High fatigue detected from mental load entry.'
            : '',
      aiStudySuggestion: buildSuggestion({ workloadLevel, mentalLoad })
    });
  }

  return {
    schedule: plans,
    unscheduledTasks: pendingTasks
      .filter((task) => !task._scheduled)
      .map((task) => ({
        taskId: task._id,
        title: task.title,
        estimatedDuration: task.estimatedDuration,
        reason: 'No balanced slot was available inside the selected planning window.'
      }))
  };
};

const evaluateOverload = (schedule, dailyLimit, fatigueThreshold) =>
  schedule.map((day) => {
    const overloaded = day.totalStudyHours > dailyLimit || day.fatiguePrediction >= fatigueThreshold;
    return {
      date: day.date,
      overloaded,
      totalStudyHours: day.totalStudyHours,
      fatiguePrediction: day.fatiguePrediction,
      workloadLevel: day.workloadLevel,
      suggestions: overloaded
        ? [
            'Reduce lower-priority tasks for this day.',
            'Move one task to the next lighter day.',
            'Add a rest or revision-only block.'
          ]
        : ['Current workload is within the recommended range.']
    };
  });

module.exports = {
  generateSchedule,
  evaluateOverload,
  getPriorityScore
};
