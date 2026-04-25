const request = require('supertest');
const app = require('../app');

const registerAndLogin = async (overrides = {}) => {
  const payload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'StrongPass1',
    university: 'Test University',
    course: 'Engineering',
    studyPreferences: {
      availableDailyHours: 5,
      preferredStudyWindow: 'evening',
      breakPreferenceMinutes: 25
    },
    ...overrides
  };

  await request(app).post('/api/auth/register/request-otp').send(payload);

  const response = await request(app).post('/api/auth/register/verify-otp').send({
    email: payload.email,
    otp: process.env.TEST_OTP_CODE
  });

  return {
    token: response.body.token,
    user: response.body.user
  };
};

module.exports = { request, app, registerAndLogin };
