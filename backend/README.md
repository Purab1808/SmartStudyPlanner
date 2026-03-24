# Smart Study Planner Backend

Original Node.js/Express/MongoDB backend for study planning with mental load tracking.

## Run

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Core Features

- JWT authentication with bcrypt password hashing
- Subject, task, mental load, schedule, and analytics APIs
- Adaptive scheduling engine based on deadlines, difficulty, and fatigue
- Rate limiting, Helmet, CORS, validation, centralized error handling
- Swagger UI at `/api/docs`
- Jest and Supertest sample coverage

## Example Responses

`POST /api/auth/register`

```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": "664f0d4c72f6e5f1490f933a",
    "name": "Ava Patel",
    "email": "ava@example.com",
    "university": "State University",
    "course": "Computer Science",
    "studyPreferences": {
      "availableDailyHours": 6,
      "preferredStudyWindow": "flexible",
      "breakPreferenceMinutes": 25
    },
    "createdAt": "2026-03-16T10:00:00.000Z"
  }
}
```

`POST /api/schedule/generate`

```json
{
  "message": "Weekly study plan generated successfully",
  "planningWindow": {
    "startDate": "2026-03-16T00:00:00.000Z",
    "endDate": "2026-03-22T00:00:00.000Z",
    "availableDailyTime": 4
  },
  "schedule": [
    {
      "date": "2026-03-16T00:00:00.000Z",
      "tasks": [
        {
          "taskId": "664f0d4c72f6e5f1490f9444",
          "title": "Formula Flashcards",
          "subjectId": "664f0d4c72f6e5f1490f9440",
          "subjectName": "Physics",
          "allocatedHours": 1,
          "priorityScore": 25.4,
          "taskDifficulty": 2,
          "suggestedStartWindow": "flexible"
        }
      ],
      "totalStudyHours": 1,
      "fatiguePrediction": 9.3,
      "workloadLevel": "overloaded",
      "overloadReason": "High fatigue detected from mental load entry.",
      "aiStudySuggestion": "Shift one high-effort task to the next available low-load day and protect a recovery block."
    }
  ],
  "unscheduledTasks": []
}
```
