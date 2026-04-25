require('./setup');

const { request, app } = require('./helpers');

describe('Authentication', () => {
  it('registers a user through OTP verification and returns a token', async () => {
    await request(app).post('/api/auth/register/request-otp').send({
      name: 'Ava Patel',
      email: 'ava@example.com',
      password: 'StrongPass1',
      university: 'State University',
      course: 'Computer Science',
      studyPreferences: {
        availableDailyHours: 5,
        preferredStudyWindow: 'evening',
        breakPreferenceMinutes: 25
      }
    });

    const response = await request(app).post('/api/auth/register/verify-otp').send({
      email: 'ava@example.com',
      otp: process.env.TEST_OTP_CODE
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('ava@example.com');
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/auth/register/request-otp').send({
      name: 'Ava Patel',
      email: 'ava@example.com',
      password: 'StrongPass1',
      university: 'State University',
      course: 'Computer Science',
      studyPreferences: {
        availableDailyHours: 5,
        preferredStudyWindow: 'evening',
        breakPreferenceMinutes: 25
      }
    });

    await request(app).post('/api/auth/register/verify-otp').send({
      email: 'ava@example.com',
      otp: process.env.TEST_OTP_CODE
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'ava@example.com',
      password: 'StrongPass1'
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
