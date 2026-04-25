const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const average = (values, fallback = 0) => {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const classifyRiskLevel = (riskScore) => {
  if (riskScore >= 70) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
};

const buildDrivers = ({
  averageFatigue,
  averageStress,
  averageSleep,
  averageMotivation,
  pendingTasks,
  heavyPendingTasks,
  overloadedDays,
  completionRate
}) => {
  const drivers = [];

  if (averageFatigue >= 7) {
    drivers.push('Fatigue trend has stayed high in recent check-ins.');
  }

  if (averageStress >= 7) {
    drivers.push('Stress level is elevated and can reduce deep-focus capacity.');
  }

  if (averageSleep > 0 && averageSleep < 6.5) {
    drivers.push('Recent sleep is below the healthier study-recovery range.');
  }

  if (averageMotivation > 0 && averageMotivation <= 4) {
    drivers.push('Motivation has dropped, so the current plan may feel harder to sustain.');
  }

  if (heavyPendingTasks >= 3) {
    drivers.push('Several heavy pending tasks are still waiting, which increases overload pressure.');
  }

  if (pendingTasks >= 6) {
    drivers.push('A large pending workload is building up across subjects.');
  }

  if (overloadedDays >= 2) {
    drivers.push('Multiple scheduled days already look overloaded.');
  }

  if (completionRate <= 0.35 && pendingTasks > 0) {
    drivers.push('Recent completion reliability is low compared with planned work.');
  }

  if (!drivers.length) {
    drivers.push('Current study behavior looks relatively balanced and manageable.');
  }

  return drivers;
};

const buildRecommendation = (riskLevel, context) => {
  const { heavyPendingTasks, overloadedDays, averageSleep } = context;

  if (riskLevel === 'high') {
    if (overloadedDays >= 2) {
      return 'Shift one heavy task from the busiest day, keep one lighter revision block, and add a recovery evening.';
    }

    if (heavyPendingTasks >= 3) {
      return 'Break heavy tasks into shorter sessions and avoid stacking deep-focus blocks on consecutive days.';
    }

    return 'Reduce tomorrow’s workload, keep only priority tasks, and add recovery time before the next heavy session.';
  }

  if (riskLevel === 'medium') {
    if (averageSleep > 0 && averageSleep < 6.5) {
      return 'Keep the current plan balanced, but shorten late study blocks until sleep stabilizes.';
    }

    return 'Use a balanced plan with one demanding block and one lighter revision block per day.';
  }

  return 'Current load looks sustainable. Keep the routine steady and preserve one buffer slot for unexpected work.';
};

const predictBurnoutRisk = ({ mentalLoads = [], tasks = [], schedules = [] }) => {
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const heavyPendingTasks = pendingTasks.filter(
    (task) => task.difficultyLevel >= 4 || task.estimatedDuration >= 2
  ).length;
  const overloadedDays = schedules.filter(
    (schedule) => schedule.workloadLevel === 'overloaded' || schedule.totalStudyHours > 6
  ).length;

  const averageFatigue = average(
    mentalLoads.map((entry) => entry.fatigueLevel),
    pendingTasks.length ? 5.5 : 4.5
  );
  const averageStress = average(
    mentalLoads.map((entry) => entry.stressLevel),
    pendingTasks.length ? 5.5 : 4
  );
  const averageMotivation = average(
    mentalLoads.map((entry) => entry.motivationLevel),
    6
  );
  const averageSleep = average(
    mentalLoads.map((entry) => entry.sleepHours),
    7
  );
  const totalPlannedHours = schedules.reduce((sum, schedule) => sum + schedule.totalStudyHours, 0);
  const completionRate =
    completedTasks.length + pendingTasks.length
      ? completedTasks.length / (completedTasks.length + pendingTasks.length)
      : 0.5;

  const normalizedFatigue = clamp((averageFatigue / 10) * 100, 0, 100);
  const normalizedStress = clamp((averageStress / 10) * 100, 0, 100);
  const normalizedMotivationDrag = clamp(((10 - averageMotivation) / 10) * 100, 0, 100);
  const normalizedSleepPenalty = clamp(((8 - averageSleep) / 4) * 100, 0, 100);
  const normalizedPendingLoad = clamp((pendingTasks.length / 10) * 100, 0, 100);
  const normalizedHeavyTaskLoad = clamp((heavyPendingTasks / 5) * 100, 0, 100);
  const normalizedOverload = clamp((overloadedDays / 4) * 100, 0, 100);
  const normalizedCompletionDrag = clamp((1 - completionRate) * 100, 0, 100);
  const normalizedPlannedHours = clamp((totalPlannedHours / 30) * 100, 0, 100);

  const riskScore = Math.round(
    normalizedFatigue * 0.22 +
      normalizedStress * 0.18 +
      normalizedMotivationDrag * 0.08 +
      normalizedSleepPenalty * 0.12 +
      normalizedPendingLoad * 0.12 +
      normalizedHeavyTaskLoad * 0.1 +
      normalizedOverload * 0.08 +
      normalizedCompletionDrag * 0.06 +
      normalizedPlannedHours * 0.04
  );

  const riskLevel = classifyRiskLevel(riskScore);

  const signals = {
    averageFatigue: Number(averageFatigue.toFixed(2)),
    averageStress: Number(averageStress.toFixed(2)),
    averageMotivation: Number(averageMotivation.toFixed(2)),
    averageSleep: Number(averageSleep.toFixed(2)),
    pendingTasks: pendingTasks.length,
    completedTasks: completedTasks.length,
    heavyPendingTasks,
    overloadedDays,
    totalPlannedHours: Number(totalPlannedHours.toFixed(2)),
    completionRate: Number((completionRate * 100).toFixed(2))
  };

  return {
    riskScore,
    riskLevel,
    signals,
    drivers: buildDrivers({
      averageFatigue,
      averageStress,
      averageSleep,
      averageMotivation,
      pendingTasks: pendingTasks.length,
      heavyPendingTasks,
      overloadedDays,
      completionRate
    }),
    recommendation: buildRecommendation(riskLevel, {
      heavyPendingTasks,
      overloadedDays,
      averageSleep
    }),
    modelNotes:
      'Weighted predictive prototype based on recent mental-load entries, pending workload, schedule pressure, and completion behavior.'
  };
};

module.exports = {
  predictBurnoutRisk
};
