require('./setup');

const { request, app, registerAndLogin } = require('./helpers');

describe('Task CRUD', () => {
  it('creates, updates, and completes a task', async () => {
    const { token } = await registerAndLogin();

    const subjectResponse = await request(app)
      .post('/api/subjects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subjectName: 'Mathematics',
        difficultyLevel: 4,
        priority: 5,
        estimatedHours: 20,
        examDate: '2026-05-20'
      });

    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Calculus Revision',
        subjectId: subjectResponse.body.subject._id,
        estimatedDuration: 2,
        difficultyLevel: 4,
        deadline: '2026-04-01',
        priority: 5
      });

    expect(taskResponse.status).toBe(201);

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskResponse.body.task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Calculus Revision Session 1',
        subjectId: subjectResponse.body.subject._id,
        estimatedDuration: 1.5,
        difficultyLevel: 3,
        deadline: '2026-04-02',
        priority: 4,
        status: 'pending'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.task.title).toContain('Session 1');

    const completeResponse = await request(app)
      .patch(`/api/tasks/${taskResponse.body.task._id}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.task.status).toBe('completed');
  });
});
