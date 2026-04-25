# Smart Study Planner Backend

Original Express/MongoDB backend for a recovery-aware study planner with mental-load tracking, behavior-based stress/motivation estimation, adaptive scheduling, burnout-risk prediction, and analytics.

## Run

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API health check:

```text
GET http://localhost:5001/api/health
```

Swagger docs in development:

```text
GET http://localhost:5001/api/docs
```

## Environment

Copy `.env.example` to `.env` and set real values for MongoDB, JWT secrets, OTP secret, and SMTP credentials.

Important:

- Do not commit `.env`.
- Do not commit `node_modules`.
- Rotate secrets if they were shared anywhere.

## Core Modules

- OTP-based registration and password reset
- JWT-protected profile, subject, task, mental-load, schedule, and analytics routes
- Subject CRUD
- Task CRUD, completion, and user-confirmed overdue task rescheduling
- Mental-load check-in with user-entered fatigue/sleep and behavior-estimated stress/motivation
- Smart schedule generation
- Overload warnings
- Burnout-risk prediction
- Study-time, fatigue-pattern, and productivity analytics

## Main API Routes

Authentication:

```text
POST /api/auth/register/request-otp
POST /api/auth/register/verify-otp
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile
DELETE /api/auth/profile
POST /api/auth/forgot-password/request-otp
POST /api/auth/forgot-password/reset
```

Subjects:

```text
GET    /api/subjects
POST   /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

Tasks:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/complete
PATCH  /api/tasks/:id/reschedule
```

Mental Load:

```text
GET  /api/mental-load
POST /api/mental-load
GET  /api/mental-load/:date
```

Schedules:

```text
POST   /api/schedule/generate
GET    /api/schedule
GET    /api/schedule/:date
DELETE /api/schedule
GET    /api/schedule/overload-check
```

Analytics:

```text
GET /api/analytics/study-time
GET /api/analytics/fatigue-pattern
GET /api/analytics/productivity-score
GET /api/analytics/burnout-risk
```

## Novelty / Differentiation

This is not only a task planner. The system estimates study pressure from user behavior and uses it in planning:

- Stress and motivation are estimated from pending tasks, overdue tasks, heavy task load, completed work, overloaded days, fatigue, and sleep.
- Burnout risk is predicted from recent mental-load and workload signals.
- Schedules adapt to fatigue and workload pressure.
- Overdue unfinished tasks can be explicitly rescheduled by the user.

## Security Notes

- Passwords are hashed with bcrypt.
- Pending registration passwords are stored as hashes before account creation.
- OTP values are HMAC-hashed at rest.
- OTP attempts are capped.
- Temporary OTP documents expire through TTL indexes.
- JWT protects private APIs.
- Helmet, CORS, rate limiting, and validation middleware are enabled.

## Testing

```bash
cd backend
npm test
```

Tests use an in-memory MongoDB instance and a fixed test OTP in `NODE_ENV=test`.

## Submission Notes

Submit source code, `package.json`, `package-lock.json`, `.env.example`, README files, tests, and documentation. Exclude `.env`, `node_modules`, `dist`, and generated logs.
