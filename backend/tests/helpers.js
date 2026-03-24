const request = require('supertest');
const app = require('../app');

const registerAndLogin = async (overrides = {}) => {
  const payload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'StrongPass1',
    university: 'Test University',
    course: 'Engineering',
    ...overrides
  };

  const response = await request(app).post('/api/auth/register').send(payload);

  return {
    token: response.body.token,
    user: response.body.user
  };
};

module.exports = { request, app, registerAndLogin };
