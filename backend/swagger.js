const swaggerJSDoc = require('swagger-jsdoc');

const apiPort = process.env.PORT || 5000;

const jsonBody = (schema, example) => ({
  required: true,
  content: {
    'application/json': {
      schema,
      example
    }
  }
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Study Planner API',
      version: '1.0.0',
      description: 'REST API for authentication, study planning, mental load tracking, schedules, and analytics.'
    },
    servers: [
      {
        url: `http://localhost:${apiPort}/api`,
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      parameters: {
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'MongoDB document id'
        },
        DateParam: {
          name: 'date',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'date' },
          description: 'Date in YYYY-MM-DD format'
        },
        StartDateQuery: {
          name: 'startDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date' }
        },
        EndDateQuery: {
          name: 'endDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date' }
        },
        DaysQuery: {
          name: 'days',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 14 }
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'university', 'course', 'studyPreferences'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            university: { type: 'string' },
            course: { type: 'string' },
            studyPreferences: {
              type: 'object',
              properties: {
                availableDailyHours: { type: 'number' },
                preferredStudyWindow: {
                  type: 'string',
                  enum: ['morning', 'afternoon', 'evening', 'flexible']
                },
                breakPreferenceMinutes: { type: 'integer' }
              }
            }
          }
        },
        VerifyOtpRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6 }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' }
          }
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'otp', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6 },
            newPassword: { type: 'string', minLength: 8 }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            university: { type: 'string' },
            course: { type: 'string' },
            studyPreferences: {
              type: 'object',
              properties: {
                availableDailyHours: { type: 'number' },
                preferredStudyWindow: {
                  type: 'string',
                  enum: ['morning', 'afternoon', 'evening', 'flexible']
                },
                breakPreferenceMinutes: { type: 'integer' }
              }
            }
          }
        },
        SubjectRequest: {
          type: 'object',
          required: ['subjectName', 'difficultyLevel', 'priority', 'estimatedHours', 'examDate'],
          properties: {
            subjectName: { type: 'string' },
            difficultyLevel: { type: 'integer', minimum: 1, maximum: 5 },
            priority: { type: 'integer', minimum: 1, maximum: 5 },
            estimatedHours: { type: 'number', minimum: 0.5 },
            examDate: { type: 'string', format: 'date' }
          }
        },
        TaskRequest: {
          type: 'object',
          required: ['title', 'subjectId', 'estimatedDuration', 'difficultyLevel', 'deadline', 'priority'],
          properties: {
            title: { type: 'string' },
            subjectId: { type: 'string' },
            estimatedDuration: { type: 'number', minimum: 0.25 },
            difficultyLevel: { type: 'integer', minimum: 1, maximum: 5 },
            deadline: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            priority: { type: 'integer', minimum: 1, maximum: 5 }
          }
        },
        RescheduleTaskRequest: {
          type: 'object',
          required: ['deadline'],
          properties: {
            deadline: { type: 'string', format: 'date' }
          }
        },
        MentalLoadRequest: {
          type: 'object',
          required: ['fatigueLevel', 'sleepHours', 'date'],
          properties: {
            fatigueLevel: { type: 'integer', minimum: 1, maximum: 10 },
            sleepHours: { type: 'number', minimum: 0, maximum: 24 },
            date: { type: 'string', format: 'date' }
          }
        },
        GenerateScheduleRequest: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            days: { type: 'integer', minimum: 1, maximum: 14 },
            availableDailyTime: { type: 'number', minimum: 1, maximum: 16 }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          tags: ['System'],
          security: [],
          responses: {
            200: { description: 'API status' }
          }
        }
      },
      '/auth/register/request-otp': {
        post: {
          summary: 'Send registration OTP',
          tags: ['Authentication'],
          security: [],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/RegisterRequest' },
            {
              name: 'Purab',
              email: 'purab@example.com',
              password: 'StrongPass1',
              university: 'ABC University',
              course: 'BTech CSE',
              studyPreferences: {
                availableDailyHours: 5,
                preferredStudyWindow: 'evening',
                breakPreferenceMinutes: 25
              }
            }
          ),
          responses: {
            201: { description: 'Registration OTP sent' }
          }
        }
      },
      '/auth/register/verify-otp': {
        post: {
          summary: 'Verify registration OTP and create account',
          tags: ['Authentication'],
          security: [],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/VerifyOtpRequest' },
            {
              email: 'purab@example.com',
              otp: '123456'
            }
          ),
          responses: {
            201: { description: 'User registered after OTP verification' }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Authentication'],
          security: [],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/LoginRequest' },
            {
              email: 'purab@example.com',
              password: 'StrongPass1'
            }
          ),
          responses: {
            200: { description: 'Login successful' }
          }
        }
      },
      '/auth/logout': {
        post: {
          summary: 'Logout user',
          tags: ['Authentication'],
          responses: {
            200: { description: 'Logout response' }
          }
        }
      },
      '/auth/forgot-password/request-otp': {
        post: {
          summary: 'Send password reset OTP',
          tags: ['Authentication'],
          security: [],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/ForgotPasswordRequest' },
            {
              email: 'purab@example.com'
            }
          ),
          responses: {
            200: { description: 'Password reset OTP sent' }
          }
        }
      },
      '/auth/forgot-password/reset': {
        post: {
          summary: 'Reset password using email OTP',
          tags: ['Authentication'],
          security: [],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/ResetPasswordRequest' },
            {
              email: 'purab@example.com',
              otp: '123456',
              newPassword: 'NewStrongPass1'
            }
          ),
          responses: {
            200: { description: 'Password reset successful' }
          }
        }
      },
      '/auth/profile': {
        get: {
          summary: 'Get current user profile',
          tags: ['Authentication'],
          responses: {
            200: { description: 'Profile returned' }
          }
        },
        put: {
          summary: 'Update current user profile',
          tags: ['Authentication'],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/UpdateProfileRequest' },
            {
              name: 'Purab Vats',
              university: 'ABC University',
              course: 'BTech CSE',
              studyPreferences: {
                availableDailyHours: 6,
                preferredStudyWindow: 'morning',
                breakPreferenceMinutes: 20
              }
            }
          ),
          responses: {
            200: { description: 'Profile updated' }
          }
        },
        delete: {
          summary: 'Delete current user account',
          tags: ['Authentication'],
          responses: {
            200: { description: 'Account deleted' }
          }
        }
      },
      '/subjects': {
        get: {
          summary: 'List subjects',
          tags: ['Subjects'],
          responses: {
            200: { description: 'Subjects returned' }
          }
        },
        post: {
          summary: 'Create subject',
          tags: ['Subjects'],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/SubjectRequest' },
            {
              subjectName: 'Mathematics',
              difficultyLevel: 4,
              priority: 5,
              estimatedHours: 20,
              examDate: '2026-04-20'
            }
          ),
          responses: {
            201: { description: 'Subject created' }
          }
        }
      },
      '/subjects/{id}': {
        get: {
          summary: 'Get subject by id',
          tags: ['Subjects'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: 'Subject returned' }
          }
        },
        put: {
          summary: 'Update subject',
          tags: ['Subjects'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/SubjectRequest' },
            {
              subjectName: 'Mathematics',
              difficultyLevel: 3,
              priority: 4,
              estimatedHours: 18,
              examDate: '2026-04-22'
            }
          ),
          responses: {
            200: { description: 'Subject updated' }
          }
        },
        delete: {
          summary: 'Delete subject',
          tags: ['Subjects'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: 'Subject deleted' }
          }
        }
      },
      '/tasks': {
        get: {
          summary: 'List tasks',
          tags: ['Tasks'],
          responses: {
            200: { description: 'Tasks returned' }
          }
        },
        post: {
          summary: 'Create task',
          tags: ['Tasks'],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/TaskRequest' },
            {
              title: 'Calculus Practice',
              subjectId: 'PASTE_SUBJECT_ID_HERE',
              estimatedDuration: 2,
              difficultyLevel: 4,
              deadline: '2026-04-10',
              priority: 5
            }
          ),
          responses: {
            201: { description: 'Task created' }
          }
        }
      },
      '/tasks/{id}': {
        get: {
          summary: 'Get task by id',
          tags: ['Tasks'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: 'Task returned' }
          }
        },
        put: {
          summary: 'Update task',
          tags: ['Tasks'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/TaskRequest' },
            {
              title: 'Calculus Practice Session 2',
              subjectId: 'PASTE_SUBJECT_ID_HERE',
              estimatedDuration: 1.5,
              difficultyLevel: 3,
              deadline: '2026-04-12',
              status: 'pending',
              priority: 4
            }
          ),
          responses: {
            200: { description: 'Task updated' }
          }
        },
        delete: {
          summary: 'Delete task',
          tags: ['Tasks'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: 'Task deleted' }
          }
        }
      },
      '/tasks/{id}/complete': {
        patch: {
          summary: 'Mark task as completed',
          tags: ['Tasks'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: 'Task marked complete' }
          }
        }
      },
      '/tasks/{id}/reschedule': {
        patch: {
          summary: 'Reschedule an unfinished overdue task',
          tags: ['Tasks'],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/RescheduleTaskRequest' },
            {
              deadline: '2026-04-25'
            }
          ),
          responses: {
            200: { description: 'Task rescheduled' }
          }
        }
      },
      '/mental-load': {
        get: {
          summary: 'List mental load entries',
          tags: ['Mental Load'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Mental load entries returned' }
          }
        },
        post: {
          summary: 'Create or update mental load entry',
          tags: ['Mental Load'],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/MentalLoadRequest' },
            {
              fatigueLevel: 6,
              sleepHours: 7,
              date: '2026-03-16'
            }
          ),
          responses: {
            201: { description: 'Mental load saved' }
          }
        }
      },
      '/mental-load/{date}': {
        get: {
          summary: 'Get mental load by date',
          tags: ['Mental Load'],
          parameters: [{ $ref: '#/components/parameters/DateParam' }],
          responses: {
            200: { description: 'Mental load returned' }
          }
        }
      },
      '/schedule/generate': {
        post: {
          summary: 'Generate optimized weekly schedule',
          tags: ['Schedule'],
          requestBody: jsonBody(
            { $ref: '#/components/schemas/GenerateScheduleRequest' },
            {
              startDate: '2026-03-16',
              days: 7,
              availableDailyTime: 5
            }
          ),
          responses: {
            201: { description: 'Schedule generated' }
          }
        }
      },
      '/schedule/overload-check': {
        get: {
          summary: 'Check overloaded days',
          tags: ['Schedule'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/DaysQuery' }
          ],
          responses: {
            200: { description: 'Overload analysis returned' }
          }
        }
      },
      '/schedule': {
        get: {
          summary: 'List stored schedules',
          tags: ['Schedule'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Schedules returned' }
          }
        },
        delete: {
          summary: 'Delete stored schedules',
          tags: ['Schedule'],
          responses: {
            200: { description: 'Schedules deleted' }
          }
        }
      },
      '/schedule/{date}': {
        get: {
          summary: 'Get schedule by date',
          tags: ['Schedule'],
          parameters: [{ $ref: '#/components/parameters/DateParam' }],
          responses: {
            200: { description: 'Schedule returned' }
          }
        }
      },
      '/analytics/study-time': {
        get: {
          summary: 'Get study time analytics',
          tags: ['Analytics'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Study-time analytics returned' }
          }
        }
      },
      '/analytics/fatigue-pattern': {
        get: {
          summary: 'Get fatigue pattern analytics',
          tags: ['Analytics'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Fatigue analytics returned' }
          }
        }
      },
      '/analytics/productivity-score': {
        get: {
          summary: 'Get productivity score',
          tags: ['Analytics'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Productivity score returned' }
          }
        }
      },
      '/analytics/burnout-risk': {
        get: {
          summary: 'Get predictive burnout risk analysis',
          tags: ['Analytics'],
          parameters: [
            { $ref: '#/components/parameters/StartDateQuery' },
            { $ref: '#/components/parameters/EndDateQuery' }
          ],
          responses: {
            200: { description: 'Burnout risk analytics returned' }
          }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJSDoc(options);
