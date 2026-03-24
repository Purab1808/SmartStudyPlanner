require('./setup');

const { request, app, registerAndLogin } = require('./helpers');

describe('Schedule generation', () => {
  it('generates a study plan that respects fatigue signals', async () => {
    const { token } = await registerAndLogin();

    const subjectResponse = await request(app)
      .post('/api/subjects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subjectName: 'Physics',
        difficultyLevel: 5,
        priority: 5,
        estimatedHours: 18,
        examDate: '2026-04-15'
      });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Quantum Mechanics Practice',
        subjectId: subjectResponse.body.subject._id,
        estimatedDuration: 3,
        difficultyLevel: 5,
        deadline: '2026-03-20',
        priority: 5
      });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Formula Flashcards',
        subjectId: subjectResponse.body.subject._id,
        estimatedDuration: 1,
        difficultyLevel: 2,
        deadline: '2026-03-19',
        priority: 4
      });

    await request(app)
      .post('/api/mental-load')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fatigueLevel: 9,
        stressLevel: 7,
        motivationLevel: 4,
        sleepHours: 5,
        date: '2026-03-16'
      });

    const response = await request(app)
      .post('/api/schedule/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        startDate: '2026-03-16',
        days: 7,
        availableDailyTime: 4
      });

    expect(response.status).toBe(201);
    expect(response.body.schedule).toHaveLength(7);
    expect(response.body.schedule[0].totalStudyHours).toBeLessThanOrEqual(4);
    expect(response.body.schedule[0].tasks.length).toBeLessThanOrEqual(1);
  });
});
