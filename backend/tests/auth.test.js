require('./setup');

const { request, app } = require('./helpers');

describe('Authentication', () => {
  it('registers a user and returns a token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Ava Patel',
      email: 'ava@example.com',
      password: 'StrongPass1',
      university: 'State University',
      course: 'Computer Science'
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('ava@example.com');
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Ava Patel',
      email: 'ava@example.com',
      password: 'StrongPass1'
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'ava@example.com',
      password: 'StrongPass1'
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
