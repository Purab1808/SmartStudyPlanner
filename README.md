# Smart Study Planner with Mental Load Tracking

A sophisticated full-stack academic planning and productivity system that intelligently combines subject/task management, behavior-aware mental-load estimation, adaptive scheduling algorithms, overload detection, and burnout-risk analytics. Designed for students to optimize study performance while maintaining mental wellness.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [What Makes It Different](#what-makes-it-different)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Features in Detail](#features-in-detail)
- [Testing](#testing)
- [Copyright & Intellectual Property](#copyright--intellectual-property)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

Smart Study Planner is a production-ready web application that addresses a critical gap in academic productivity tools: most study planners merely track tasks and deadlines, but fail to account for the student's mental state and workload capacity.

This system employs intelligent algorithms to:
- **Estimate mental state** from user behavior patterns (fatigue, stress, motivation, sleep)
- **Predict burnout risk** using multifactorial analysis
- **Generate adaptive schedules** that adjust to realistic capacity levels
- **Detect overload conditions** and suggest workload adjustments
- **Provide actionable analytics** on productivity, fatigue trends, and study patterns

---

## Key Features

### 🔐 Authentication & User Management
- **OTP-based registration** with email verification
- **Secure password reset** via email OTP
- **JWT authentication** for protected endpoints
- **User profile management** with personalized settings

### 📚 Academic Planning
- **Subject management** with priority levels and credit hours
- **Task creation & tracking** with difficulty levels and estimated duration
- **Status management** (pending, in-progress, completed, overdue)
- **User-confirmed rescheduling** of overdue tasks

### 🧠 Mental Load Tracking
- **Daily check-ins** with user-reported fatigue and sleep metrics
- **Behavior-based estimation** of stress and motivation levels
- **Historical mental state tracking** for trend analysis
- **Fatigue-aware scheduling** adjustments

### 📅 Intelligent Scheduling
- **Adaptive schedule generation** based on:
  - Task priority, difficulty, and deadline
  - Subject priority and credit weight
  - Current user fatigue levels
  - Workload capacity and balance
- **Overload warnings** with actionable suggestions
- **Daily study time customization**
- **Intelligent task distribution** across planning horizon

### 📊 Analytics & Insights
- **Study time analytics** - total hours, daily averages, completion rates
- **Fatigue pattern tracking** - 7-day trend visualization
- **Productivity metrics** - completion rates by subject and difficulty
- **Burnout risk prediction** with risk drivers and recommendations
- **Wellbeing dashboard** with visual health indicators

### ⚡ Performance & Reliability
- **Rate limiting** to prevent abuse
- **Input validation** across all endpoints
- **Security headers** via Helmet.js
- **CORS protection** with configurable origins
- **Comprehensive error handling** with descriptive messages
- **Graceful shutdown** handling

---

## What Makes It Different

**Traditional study planners:**
- Store tasks and deadlines
- Provide basic reminders
- No awareness of student capacity or mental state

**Smart Study Planner:**
- **Behavior-aware:** Automatically estimates stress and motivation from usage patterns
- **Capacity-conscious:** Adapts schedules based on current fatigue and workload
- **Burnout-focused:** Predicts burnout risk using factors like:
  - Fatigue levels and sleep patterns
  - Pending task accumulation
  - Overdue work backlog
  - Task difficulty distribution
  - Completion behavior
  - Days with overloaded schedules
- **Recovery-optimized:** Reschedules tasks when overdue to prevent cascading stress
- **Data-driven:** Provides analytics to understand productivity and wellness trends

---

## Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Vite 5.4** - Lightning-fast build tool and dev server
- **React Router DOM 6.28** - Client-side routing
- **Axios 1.7** - HTTP client for API communication
- **GSAP 3.15** - Smooth animations and UI transitions
- **Custom responsive CSS** - Tailored styling without heavy frameworks

### Backend
- **Node.js** with **Express.js 4.19** - REST API framework
- **MongoDB 8.23** with **Mongoose** - Document database and ODM
- **JWT (jsonwebtoken)** - Stateless authentication
- **bcryptjs** - Password hashing
- **Nodemailer 6.9** - Email delivery (OTP, password reset)
- **Helmet 7.1** - Security headers
- **Express Rate Limit** - DDoS protection
- **Express Validator 7.2** - Input validation
- **Swagger/OpenAPI** - Interactive API documentation

### Testing
- **Jest 29.7** - Test runner and assertion library
- **Supertest 7.0** - HTTP assertion library
- **MongoDB Memory Server 10.1** - In-memory MongoDB for testing

### DevTools
- **Nodemon 3.1** - Auto-restart server during development
- **Morgan 1.10** - HTTP request logging

---

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher) with npm
- **MongoDB Atlas** account (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
  - Alternative: Local MongoDB instance
- **Gmail account** (for SMTP email configuration, optional for development)
- **Git** for version control
- **Code editor** (VS Code recommended)

### System Requirements
- **RAM:** Minimum 2GB free RAM
- **Disk:** 500MB free space
- **Browser:** Modern browser (Chrome, Firefox, Safari, Edge)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ProjectCopyright
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template and configure
copy .env.example .env
# Edit .env with your configuration (see Environment Configuration section)

# Install complete
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment template and configure
copy .env.example .env
# Ensure VITE_API_BASE_URL points to your backend

# Setup complete
```

---

## Environment Configuration

### Backend Environment Variables (.env)

Create `backend/.env` based on `backend/.env.example`. Here's what each variable does:

#### Server Configuration
```env
# Port where backend runs (default: 5000, recommended: 5001)
PORT=5001

# Environment: development, production, test
NODE_ENV=development

# Frontend URL for CORS validation
CLIENT_URL=http://localhost:5173
```

#### Database Configuration
```env
# MongoDB Atlas connection string
# Format: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE?retryWrites=true&w=majority
# Get this from MongoDB Atlas -> Connect -> Driver connection string
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/smart-study-planner?retryWrites=true&w=majority
```

#### Authentication & Security
```env
# JWT secret for token signing (use a strong random string, minimum 32 characters)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_secret_min_32_chars

# How long JWT tokens are valid for
JWT_EXPIRES_IN=7d

# Secret for OTP hashing (use a different strong random string)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OTP_HASH_SECRET=replace_with_a_different_long_random_secret

# Maximum OTP validation attempts before lockout
MAX_OTP_ATTEMPTS=5
```

#### Rate Limiting
```env
# Rate limit window in milliseconds (default: 15 minutes = 900000)
RATE_LIMIT_WINDOW_MS=900000

# Maximum requests per window per IP
RATE_LIMIT_MAX=200
```

#### Study Configuration
```env
# Default daily study time limit in hours
DEFAULT_DAILY_STUDY_LIMIT=6

# Fatigue threshold for overload warnings (0-10 scale)
# When fatigue >= this value, system triggers overload warnings
FATIGUE_OVERLOAD_THRESHOLD=8
```

#### Email/SMTP Configuration (for OTP and password reset)
```env
# Gmail SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Your Gmail address
SMTP_USER=your_email@gmail.com

# Gmail App-specific password (NOT your regular password)
# Generate at: https://myaccount.google.com/apppasswords
# Must be 16 characters without spaces
SMTP_PASS=your_gmail_app_password_without_spaces

# Display name for emails sent from the system
SMTP_FROM_NAME=Smart Study Planner
```

#### API Documentation
```env
# Enable Swagger/OpenAPI documentation UI
ENABLE_SWAGGER=true
```

#### Example Complete .env File
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/smart-study-planner?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_xyz123
JWT_EXPIRES_IN=7d
OTP_HASH_SECRET=your_super_secret_otp_key_at_least_32_characters_long_abc456
MAX_OTP_ATTEMPTS=5
CLIENT_URL=http://localhost:5173
ENABLE_SWAGGER=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
DEFAULT_DAILY_STUDY_LIMIT=6
FATIGUE_OVERLOAD_THRESHOLD=8
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16char_app_password
SMTP_FROM_NAME=Smart Study Planner
```

### Frontend Environment Variables (.env)

Create `frontend/.env` based on `frontend/.env.example`:

```env
# Backend API base URL (must match your backend's PORT and URL)
VITE_API_BASE_URL=http://localhost:5001/api
```

### ⚠️ Important Security Notes

- **NEVER commit `.env` files** to version control
- **Use strong secrets:** Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Rotate secrets in production** if they're ever exposed
- **Use environment variable management** tools in production (Heroku Config Vars, AWS Secrets Manager, etc.)
- **Gmail App Passwords:** Create at https://myaccount.google.com/apppasswords (requires 2FA enabled)

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5001`
API docs: `http://localhost:5001/api/docs`

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Health Checks
```bash
# Check if backend is running
curl http://localhost:5001/api/health
```

Expected response:
```json
{
  "message": "Smart Study Planner API is running",
  "environment": "development"
}
```

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/
```

#### Build Backend
No separate build needed; Node.js runs JavaScript directly.

#### Start Production Backend
```bash
cd backend
NODE_ENV=production npm start
```

---

## Project Structure

```
ProjectCopyright/
├── README.md                      # This file
├── backend/                       # REST API & Business Logic
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server entry point
│   ├── app.js                    # Express app configuration
│   ├── swagger.js                # OpenAPI documentation
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # Auth logic
│   │   ├── taskController.js     # Task CRUD & logic
│   │   ├── subjectController.js  # Subject CRUD
│   │   ├── mentalLoadController.js # Mental state tracking
│   │   ├── scheduleController.js # Schedule generation
│   │   └── analyticsController.js # Analytics calculations
│   ├── middleware/               # Request middleware
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorMiddleware.js    # Error handling
│   │   └── validateRequest.js    # Input validation
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js               # User accounts
│   │   ├── Subject.js            # Academic subjects
│   │   ├── Task.js               # Study tasks
│   │   ├── MentalLoad.js         # Mental state records
│   │   ├── StudySchedule.js      # Generated schedules
│   │   ├── PendingRegistration.js # Email verification
│   │   └── PasswordResetRequest.js # Password reset
│   ├── routes/                   # API endpoints
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── mentalLoadRoutes.js
│   │   ├── scheduleRoutes.js
│   │   └── analyticsRoutes.js
│   ├── tests/                    # Jest test suites
│   │   ├── setup.js              # Test configuration
│   │   ├── helpers.js            # Test utilities
│   │   ├── auth.test.js
│   │   ├── task.test.js
│   │   └── schedule.test.js
│   ├── utils/                    # Business logic utilities
│   │   ├── burnoutPrediction.js  # Burnout risk calculation
│   │   ├── schedulingAlgorithm.js # Schedule generation logic
│   │   ├── estimateMentalState.js # Behavior-based estimation
│   │   ├── date.js               # Date utilities
│   │   ├── email.js              # Email sending
│   │   ├── otp.js                # OTP generation & validation
│   │   ├── generateToken.js      # JWT generation
│   │   └── asyncHandler.js       # Try-catch wrapper
│   └── validators/               # Input validation schemas
│       ├── authValidators.js
│       ├── taskValidators.js
│       ├── subjectValidators.js
│       ├── mentalLoadValidators.js
│       ├── scheduleValidators.js
│       └── commonValidators.js
├── frontend/                     # React UI
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite build configuration
│   ├── index.html               # HTML entry point
│   └── src/
│       ├── main.jsx             # React app entry
│       ├── App.jsx              # Main component & routing
│       ├── styles.css           # Global styles
│       ├── components/          # Reusable UI components
│       │   ├── ProtectedRoute.jsx # Auth guard
│       │   ├── branding/        # Logo & branding
│       │   ├── cards/           # Stat & chart cards
│       │   ├── charts/          # Data visualizations
│       │   ├── feedback/        # Modals, messages, loading
│       │   ├── forms/           # Form inputs & fields
│       │   ├── layout/          # Page layouts
│       │   ├── ui/              # Basic UI elements
│       │   └── visuals/         # Animations & effects
│       ├── context/             # Global state
│       │   ├── AuthContext.jsx  # Authentication state
│       │   └── ThemeContext.jsx # Theme (light/dark mode)
│       ├── pages/               # Full page components
│       │   ├── Analytics/
│       │   ├── Dashboard/
│       │   ├── DesignLab/
│       │   ├── Landing/
│       │   ├── Login/
│       │   ├── MentalLoad/
│       │   ├── Register/
│       │   ├── Schedule/
│       │   ├── Subjects/
│       │   └── Tasks/
│       ├── services/
│       │   └── api.js           # Axios API client
│       ├── utils/
│       │   └── formatters.js    # Data formatting utilities
│       └── hooks/
│           └── useAsync.js      # Async data fetching hook
└── .gitignore                   # Git ignore rules
```

---

## API Documentation

The backend provides comprehensive API documentation via Swagger UI.

### Access API Docs
```
Development: http://localhost:5001/api/docs
```

### Key API Endpoints

#### Authentication
```
POST   /api/auth/register/request-otp          # Request registration OTP
POST   /api/auth/register/verify-otp           # Verify OTP and create account
POST   /api/auth/login                         # Login with email & password
POST   /api/auth/logout                        # Logout
GET    /api/auth/profile                       # Get user profile (protected)
PUT    /api/auth/profile                       # Update profile (protected)
DELETE /api/auth/profile                       # Delete account (protected)
POST   /api/auth/forgot-password/request-otp   # Request password reset OTP
POST   /api/auth/forgot-password/reset         # Reset password with OTP
```

#### Subjects
```
GET    /api/subjects                           # List all subjects
POST   /api/subjects                           # Create subject
GET    /api/subjects/:id                       # Get subject details
PUT    /api/subjects/:id                       # Update subject
DELETE /api/subjects/:id                       # Delete subject
```

#### Tasks
```
GET    /api/tasks                              # List tasks (with filtering)
POST   /api/tasks                              # Create task
GET    /api/tasks/:id                          # Get task details
PUT    /api/tasks/:id                          # Update task
DELETE /api/tasks/:id                          # Delete task
PATCH  /api/tasks/:id/complete                 # Mark task complete
PATCH  /api/tasks/:id/reschedule               # Reschedule overdue task
```

#### Mental Load
```
GET    /api/mental-load                        # Get today's mental state
POST   /api/mental-load                        # Log mental state check-in
GET    /api/mental-load/:date                  # Get mental state for date
```

#### Schedules
```
POST   /api/schedule/generate                  # Generate schedule
GET    /api/schedule                           # Get current schedule
GET    /api/schedule/:date                     # Get schedule for date
DELETE /api/schedule                           # Clear schedule
```

#### Analytics
```
GET    /api/analytics/summary                  # Study time & completion stats
GET    /api/analytics/fatigue-trend            # 7-day fatigue trend
GET    /api/analytics/productivity             # Completion rates by subject
GET    /api/analytics/burnout-risk             # Burnout prediction & drivers
```

---

## Features in Detail

### 🔐 Secure Authentication
- **Email-based OTP registration** prevents fake accounts
- **bcryptjs password hashing** (10 rounds) for security
- **JWT tokens** with 7-day expiration
- **Rate-limited auth endpoints** prevent brute force attacks
- **Secure password reset** via email OTP

### 📚 Intelligent Task Management
- **Priority levels** (low, medium, high)
- **Difficulty levels** (1-10) for realistic estimation
- **Estimated duration** in hours for accurate scheduling
- **Status tracking** (pending, in-progress, completed, overdue)
- **Automatic overdue detection** and rescheduling suggestions
- **Task completion rewards** that improve mental state estimates

### 🧠 Behavior-Based Mental State Estimation
The system learns from user behavior:
- **User inputs:** Daily fatigue (1-10) and sleep hours
- **Estimated metrics:**
  - **Stress:** Based on pending tasks, heavy tasks, overdue work
  - **Motivation:** Based on completion rates and recent progress
- **7-day trend analysis** for wellness insights
- **Historical data** for better predictions over time

### 📅 Smart Schedule Generation
The algorithm considers:
- **Task urgency** (deadline proximity)
- **Task priority** and difficulty
- **Subject priority** and credit hours
- **Current fatigue level** (reduces capacity)
- **Daily study limit** (default 6 hours)
- **Workload balance** (prevents consecutive overload days)
- **Recovery periods** (lighter days after heavy days)

Result: **Personalized, realistic schedules** that students can actually follow.

### 🚨 Overload Detection
System warns when:
- Daily study load exceeds capacity
- Fatigue level is high
- Too many heavy tasks scheduled
- Consecutive overloaded days detected
- Sleep is insufficient

**Actionable suggestions** help students adjust workload.

### 📊 Predictive Burnout Analytics
**Risk factors analyzed:**
- Average fatigue levels (recent check-ins)
- Stress and motivation trends
- Sleep quality and quantity
- Pending task accumulation
- Heavy pending tasks count
- Days with overloaded schedules
- Task completion rates

**Output:**
- Risk level: Low, Medium, High
- Risk score (0-100)
- Key drivers of burnout risk
- Personalized recommendations

---

## Testing

### Run Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

### Test Coverage
- Authentication workflows (registration, login, password reset)
- Task creation, update, completion, rescheduling
- Schedule generation with various conditions
- Mental load tracking and estimation
- Input validation and error handling

### Test Stack
- **Jest** - Test framework
- **Supertest** - HTTP request testing
- **MongoDB Memory Server** - In-memory test database (no external DB needed)

---

## Copyright & Intellectual Property

This project is protected under copyright laws. The intellectual property includes:

### ✅ Protected Elements
- **Original source code** - All backend and frontend implementations
- **Unique algorithms:**
  - Mental state estimation from behavior patterns
  - Fatigue-aware scheduling algorithm
  - Burnout risk prediction model
- **UI/UX design** - Component architecture, styling, layout decisions
- **Documentation** - README, API docs, code comments
- **Database schemas** - Original data model design

### ⚠️ Not Protected
- Generic concept of a "study planner"
- Standard HTTP endpoints/REST API patterns
- General algorithm concepts (priority queuing, weighted scoring)
- Open-source libraries and their patterns (Express.js, React, MongoDB patterns)

### 📄 License
This project includes:
- **Original code:** Custom implementation and algorithms (copyright protected)
- **Open-source dependencies:** MIT, ISC licenses - see package.json for details

### ✏️ Usage Rights
- ✅ Use for educational purposes
- ✅ Study and learn from the code
- ✅ Modify for personal/academic projects
- ❌ Redistribute without attribution
- ❌ Claim authorship
- ❌ Use commercially without permission
- ❌ Remove copyright notices

For commercial use or licensing inquiries, contact the repository owner.

---

## Troubleshooting

### Common Issues & Solutions

#### **Port Already in Use**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### **MongoDB Connection Failed**
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB Atlas cluster is active
- Ensure IP address is whitelisted in MongoDB Atlas
- Connection string format: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/database`

#### **Email/OTP Not Sending**
- Verify Gmail account has 2FA enabled
- Use Gmail App Password (not regular password)
- Check `SMTP_USER` and `SMTP_PASS` in `.env`
- Ensure port 587 is not blocked by firewall
- Try: `SMTP_SECURE=true` if `false` doesn't work

#### **Frontend Can't Connect to Backend**
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify backend is running (`npm run dev` in backend folder)
- Check `CLIENT_URL` matches frontend URL in backend `.env`
- Clear browser cache and reload

#### **Tests Failing**
```bash
# Ensure clean test environment
npm test -- --forceExit

# Run with verbose output
npm test -- --verbose
```

#### **CORS Errors**
- Backend `.env` - ensure `CLIENT_URL=http://localhost:5173` for dev
- Frontend `.env` - ensure `VITE_API_BASE_URL=http://localhost:5001/api`
- Check CORS is enabled in `app.js`

#### **JWT Token Errors**
- Verify `JWT_SECRET` is not empty
- Ensure `JWT_EXPIRES_IN` is valid format (e.g., `7d`, `24h`)
- Clear browser localStorage and login again

#### **High Memory Usage**
- Close unnecessary terminal windows
- Restart Node.js development servers
- Clear browser cache
- Restart your code editor

#### **Database Too Large**
```bash
# Delete development data
# Through MongoDB Atlas UI: Select collection > Delete Collection
# Or via command line:
mongodb <your-connection-string>
```

### Getting Help

If issues persist:
1. Check error messages carefully (frontend console, backend terminal)
2. Review environment variable configuration
3. Check `.env` file has all required variables
4. Verify all prerequisites are installed
5. Try clearing node_modules and reinstalling:
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```

---

## Contributing

### Guidelines for Contributors

1. **Code Quality**
   - Follow existing code style and conventions
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions focused and testable

2. **Testing**
   - Add tests for new features
   - Ensure all tests pass before submitting
   - Maintain test coverage above 80%

3. **Commits**
   - Write clear, descriptive commit messages
   - One feature/fix per commit when possible
   - Reference issue numbers in commits

4. **Pull Requests**
   - Describe changes clearly
   - Link related issues
   - Wait for review before merging

5. **Documentation**
   - Update README for new features
   - Document API changes
   - Add inline code comments

---

## Security Checklist

Before deploying to production:

- [ ] Generate new JWT and OTP secrets
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong `CLIENT_URL` (exact domain)
- [ ] Configure Gmail App Password for email
- [ ] Set rate limits appropriately
- [ ] Enable HTTPS/SSL
- [ ] Review and update security headers in `app.js`
- [ ] Set up logging and monitoring
- [ ] Regular security updates for dependencies
- [ ] Never commit `.env` file

---

## Default URLs (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| API Health | http://localhost:5001/api/health |
| API Docs | http://localhost:5001/api/docs |
| MongoDB | See MONGO_URI in .env |

---

## Performance Tips

- **Frontend:** Use browser DevTools for performance profiling
- **Backend:** Monitor MongoDB query performance
- **Database:** Add indexes for frequently queried fields
- **Caching:** Implement Redis for session caching (production)
- **Scaling:** Use MongoDB Atlas auto-scaling for load spikes

---

## License & Copyright

© 2024-2025 Smart Study Planner Team. All rights reserved.

This project combines original application code with industry-standard open-source packages. Copyright protection applies to the innovative algorithms, original source code, UI expression, and documentation.

See [Copyright & Intellectual Property](#copyright--intellectual-property) section for details.

---

## Support & Feedback

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation at `/api/docs`

---

**Last Updated:** April 2025
**Version:** 1.0.0
**Status:** Production Ready

#### API Documentation
```env
# Enable Swagger/OpenAPI documentation UI
ENABLE_SWAGGER=true
```

#### Example Complete .env File
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/smart-study-planner?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_xyz123
JWT_EXPIRES_IN=7d
OTP_HASH_SECRET=your_super_secret_otp_key_at_least_32_characters_long_abc456
MAX_OTP_ATTEMPTS=5
CLIENT_URL=http://localhost:5173
ENABLE_SWAGGER=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
DEFAULT_DAILY_STUDY_LIMIT=6
FATIGUE_OVERLOAD_THRESHOLD=8
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16char_app_password
SMTP_FROM_NAME=Smart Study Planner
```

### Frontend Environment Variables (.env)

Create `frontend/.env` based on `frontend/.env.example`:

```env
# Backend API base URL (must match your backend's PORT and URL)
VITE_API_BASE_URL=http://localhost:5001/api
```

### ⚠️ Important Security Notes

- **NEVER commit `.env` files** to version control
- **Use strong secrets:** Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Rotate secrets in production** if they're ever exposed
- **Use environment variable management** tools in production (Heroku Config Vars, AWS Secrets Manager, etc.)
- **Gmail App Passwords:** Create at https://myaccount.google.com/apppasswords (requires 2FA enabled)

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5001`
API docs: `http://localhost:5001/api/docs`

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Health Checks
```bash
# Check if backend is running
curl http://localhost:5001/api/health
```

Expected response:
```json
{
  "message": "Smart Study Planner API is running",
  "environment": "development"
}
```

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/
```

#### Build Backend
No separate build needed; Node.js runs JavaScript directly.

#### Start Production Backend
```bash
cd backend
NODE_ENV=production npm start
```

---

## Project Structure

```
ProjectCopyright/
├── README.md                      # This file
├── backend/                       # REST API & Business Logic
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server entry point
│   ├── app.js                    # Express app configuration
│   ├── swagger.js                # OpenAPI documentation
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # Auth logic
│   │   ├── taskController.js     # Task CRUD & logic
│   │   ├── subjectController.js  # Subject CRUD
│   │   ├── mentalLoadController.js # Mental state tracking
│   │   ├── scheduleController.js # Schedule generation
│   │   └── analyticsController.js # Analytics calculations
│   ├── middleware/               # Request middleware
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorMiddleware.js    # Error handling
│   │   └── validateRequest.js    # Input validation
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js               # User accounts
│   │   ├── Subject.js            # Academic subjects
│   │   ├── Task.js               # Study tasks
│   │   ├── MentalLoad.js         # Mental state records
│   │   ├── StudySchedule.js      # Generated schedules
│   │   ├── PendingRegistration.js # Email verification
│   │   └── PasswordResetRequest.js # Password reset
│   ├── routes/                   # API endpoints
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── mentalLoadRoutes.js
│   │   ├── scheduleRoutes.js
│   │   └── analyticsRoutes.js
│   ├── tests/                    # Jest test suites
│   │   ├── setup.js              # Test configuration
│   │   ├── helpers.js            # Test utilities
│   │   ├── auth.test.js
│   │   ├── task.test.js
│   │   └── schedule.test.js
│   ├── utils/                    # Business logic utilities
│   │   ├── burnoutPrediction.js  # Burnout risk calculation
│   │   ├── schedulingAlgorithm.js # Schedule generation logic
│   │   ├── estimateMentalState.js # Behavior-based estimation
│   │   ├── date.js               # Date utilities
│   │   ├── email.js              # Email sending
│   │   ├── otp.js                # OTP generation & validation
│   │   ├── generateToken.js      # JWT generation
│   │   └── asyncHandler.js       # Try-catch wrapper
│   └── validators/               # Input validation schemas
│       ├── authValidators.js
│       ├── taskValidators.js
│       ├── subjectValidators.js
│       ├── mentalLoadValidators.js
│       ├── scheduleValidators.js
│       └── commonValidators.js
├── frontend/                     # React UI
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite build configuration
│   ├── index.html               # HTML entry point
│   └── src/
│       ├── main.jsx             # React app entry
│       ├── App.jsx              # Main component & routing
│       ├── styles.css           # Global styles
│       ├── components/          # Reusable UI components
│       │   ├── ProtectedRoute.jsx # Auth guard
│       │   ├── branding/        # Logo & branding
│       │   ├── cards/           # Stat & chart cards
│       │   ├── charts/          # Data visualizations
│       │   ├── feedback/        # Modals, messages, loading
│       │   ├── forms/           # Form inputs & fields
│       │   ├── layout/          # Page layouts
│       │   ├── ui/              # Basic UI elements
│       │   └── visuals/         # Animations & effects
│       ├── context/             # Global state
│       │   ├── AuthContext.jsx  # Authentication state
│       │   └── ThemeContext.jsx # Theme (light/dark mode)
│       ├── pages/               # Full page components
│       │   ├── Analytics/
│       │   ├── Dashboard/
│       │   ├── DesignLab/
│       │   ├── Landing/
│       │   ├── Login/
│       │   ├── MentalLoad/
│       │   ├── Register/
│       │   ├── Schedule/
│       │   ├── Subjects/
│       │   └── Tasks/
│       ├── services/
│       │   └── api.js           # Axios API client
│       ├── utils/
│       │   └── formatters.js    # Data formatting utilities
│       └── hooks/
│           └── useAsync.js      # Async data fetching hook
└── .gitignore                   # Git ignore rules
```

---

## API Documentation

The backend provides comprehensive API documentation via Swagger UI.

### Access API Docs
```
Development: http://localhost:5001/api/docs
```

### Key API Endpoints

#### Authentication
```
POST   /api/auth/register/request-otp          # Request registration OTP
POST   /api/auth/register/verify-otp           # Verify OTP and create account
POST   /api/auth/login                         # Login with email & password
POST   /api/auth/logout                        # Logout
GET    /api/auth/profile                       # Get user profile (protected)
PUT    /api/auth/profile                       # Update profile (protected)
DELETE /api/auth/profile                       # Delete account (protected)
POST   /api/auth/forgot-password/request-otp   # Request password reset OTP
POST   /api/auth/forgot-password/reset         # Reset password with OTP
```

#### Subjects
```
GET    /api/subjects                           # List all subjects
POST   /api/subjects                           # Create subject
GET    /api/subjects/:id                       # Get subject details
PUT    /api/subjects/:id                       # Update subject
DELETE /api/subjects/:id                       # Delete subject
```

#### Tasks
```
GET    /api/tasks                              # List tasks (with filtering)
POST   /api/tasks                              # Create task
GET    /api/tasks/:id                          # Get task details
PUT    /api/tasks/:id                          # Update task
DELETE /api/tasks/:id                          # Delete task
PATCH  /api/tasks/:id/complete                 # Mark task complete
PATCH  /api/tasks/:id/reschedule               # Reschedule overdue task
```

#### Mental Load
```
GET    /api/mental-load                        # Get today's mental state
POST   /api/mental-load                        # Log mental state check-in
GET    /api/mental-load/:date                  # Get mental state for date
```

#### Schedules
```
POST   /api/schedule/generate                  # Generate schedule
GET    /api/schedule                           # Get current schedule
GET    /api/schedule/:date                     # Get schedule for date
DELETE /api/schedule                           # Clear schedule
```

#### Analytics
```
GET    /api/analytics/summary                  # Study time & completion stats
GET    /api/analytics/fatigue-trend            # 7-day fatigue trend
GET    /api/analytics/productivity             # Completion rates by subject
GET    /api/analytics/burnout-risk             # Burnout prediction & drivers
```

---

## Features in Detail

### 🔐 Secure Authentication
- **Email-based OTP registration** prevents fake accounts
- **bcryptjs password hashing** (10 rounds) for security
- **JWT tokens** with 7-day expiration
- **Rate-limited auth endpoints** prevent brute force attacks
- **Secure password reset** via email OTP

### 📚 Intelligent Task Management
- **Priority levels** (low, medium, high)
- **Difficulty levels** (1-10) for realistic estimation
- **Estimated duration** in hours for accurate scheduling
- **Status tracking** (pending, in-progress, completed, overdue)
- **Automatic overdue detection** and rescheduling suggestions
- **Task completion rewards** that improve mental state estimates

### 🧠 Behavior-Based Mental State Estimation
The system learns from user behavior:
- **User inputs:** Daily fatigue (1-10) and sleep hours
- **Estimated metrics:**
  - **Stress:** Based on pending tasks, heavy tasks, overdue work
  - **Motivation:** Based on completion rates and recent progress
- **7-day trend analysis** for wellness insights
- **Historical data** for better predictions over time

### 📅 Smart Schedule Generation
The algorithm considers:
- **Task urgency** (deadline proximity)
- **Task priority** and difficulty
- **Subject priority** and credit hours
- **Current fatigue level** (reduces capacity)
- **Daily study limit** (default 6 hours)
- **Workload balance** (prevents consecutive overload days)
- **Recovery periods** (lighter days after heavy days)

Result: **Personalized, realistic schedules** that students can actually follow.

### 🚨 Overload Detection
System warns when:
- Daily study load exceeds capacity
- Fatigue level is high
- Too many heavy tasks scheduled
- Consecutive overloaded days detected
- Sleep is insufficient

**Actionable suggestions** help students adjust workload.

### 📊 Predictive Burnout Analytics
**Risk factors analyzed:**
- Average fatigue levels (recent check-ins)
- Stress and motivation trends
- Sleep quality and quantity
- Pending task accumulation
- Heavy pending tasks count
- Days with overloaded schedules
- Task completion rates

**Output:**
- Risk level: Low, Medium, High
- Risk score (0-100)
- Key drivers of burnout risk
- Personalized recommendations

---

## Testing

### Run Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

### Test Coverage
- Authentication workflows (registration, login, password reset)
- Task creation, update, completion, rescheduling
- Schedule generation with various conditions
- Mental load tracking and estimation
- Input validation and error handling

### Test Stack
- **Jest** - Test framework
- **Supertest** - HTTP request testing
- **MongoDB Memory Server** - In-memory test database (no external DB needed)

---

## Copyright & Intellectual Property

This project is protected under copyright laws. The intellectual property includes:

### ✅ Protected Elements
- **Original source code** - All backend and frontend implementations
- **Unique algorithms:**
  - Mental state estimation from behavior patterns
  - Fatigue-aware scheduling algorithm
  - Burnout risk prediction model
- **UI/UX design** - Component architecture, styling, layout decisions
- **Documentation** - README, API docs, code comments
- **Database schemas** - Original data model design

### ⚠️ Not Protected
- Generic concept of a "study planner"
- Standard HTTP endpoints/REST API patterns
- General algorithm concepts (priority queuing, weighted scoring)
- Open-source libraries and their patterns (Express.js, React, MongoDB patterns)

### 📄 License
This project includes:
- **Original code:** Custom implementation and algorithms (copyright protected)
- **Open-source dependencies:** MIT, ISC licenses - see package.json for details

### ✏️ Usage Rights
- ✅ Use for educational purposes
- ✅ Study and learn from the code
- ✅ Modify for personal/academic projects
- ❌ Redistribute without attribution
- ❌ Claim authorship
- ❌ Use commercially without permission
- ❌ Remove copyright notices

For commercial use or licensing inquiries, contact the repository owner.

---

## Troubleshooting

### Common Issues & Solutions

#### **Port Already in Use**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### **MongoDB Connection Failed**
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB Atlas cluster is active
- Ensure IP address is whitelisted in MongoDB Atlas
- Connection string format: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/database`

#### **Email/OTP Not Sending**
- Verify Gmail account has 2FA enabled
- Use Gmail App Password (not regular password)
- Check `SMTP_USER` and `SMTP_PASS` in `.env`
- Ensure port 587 is not blocked by firewall
- Try: `SMTP_SECURE=true` if `false` doesn't work

#### **Frontend Can't Connect to Backend**
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify backend is running (`npm run dev` in backend folder)
- Check `CLIENT_URL` matches frontend URL in backend `.env`
- Clear browser cache and reload

#### **Tests Failing**
```bash
# Ensure clean test environment
npm test -- --forceExit

# Run with verbose output
npm test -- --verbose
```

#### **CORS Errors**
- Backend `.env` - ensure `CLIENT_URL=http://localhost:5173` for dev
- Frontend `.env` - ensure `VITE_API_BASE_URL=http://localhost:5001/api`
- Check CORS is enabled in `app.js`

#### **JWT Token Errors**
- Verify `JWT_SECRET` is not empty
- Ensure `JWT_EXPIRES_IN` is valid format (e.g., `7d`, `24h`)
- Clear browser localStorage and login again

#### **High Memory Usage**
- Close unnecessary terminal windows
- Restart Node.js development servers
- Clear browser cache
- Restart your code editor

#### **Database Too Large**
```bash
# Delete development data
# Through MongoDB Atlas UI: Select collection > Delete Collection
# Or via command line:
mongodb <your-connection-string>
```

### Getting Help

If issues persist:
1. Check error messages carefully (frontend console, backend terminal)
2. Review environment variable configuration
3. Check `.env` file has all required variables
4. Verify all prerequisites are installed
5. Try clearing node_modules and reinstalling:
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```

---

## Contributing

### Guidelines for Contributors

1. **Code Quality**
   - Follow existing code style and conventions
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions focused and testable

2. **Testing**
   - Add tests for new features
   - Ensure all tests pass before submitting
   - Maintain test coverage above 80%

3. **Commits**
   - Write clear, descriptive commit messages
   - One feature/fix per commit when possible
   - Reference issue numbers in commits

4. **Pull Requests**
   - Describe changes clearly
   - Link related issues
   - Wait for review before merging

5. **Documentation**
   - Update README for new features
   - Document API changes
   - Add inline code comments

---

## Security Checklist

Before deploying to production:

- [ ] Generate new JWT and OTP secrets
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong `CLIENT_URL` (exact domain)
- [ ] Configure Gmail App Password for email
- [ ] Set rate limits appropriately
- [ ] Enable HTTPS/SSL
- [ ] Review and update security headers in `app.js`
- [ ] Set up logging and monitoring
- [ ] Regular security updates for dependencies
- [ ] Never commit `.env` file

---

## Default URLs (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| API Health | http://localhost:5001/api/health |
| API Docs | http://localhost:5001/api/docs |
| MongoDB | See MONGO_URI in .env |

---

## Performance Tips

- **Frontend:** Use browser DevTools for performance profiling
- **Backend:** Monitor MongoDB query performance
- **Database:** Add indexes for frequently queried fields
- **Caching:** Implement Redis for session caching (production)
- **Scaling:** Use MongoDB Atlas auto-scaling for load spikes

---

## License & Copyright

© 2024-2025 Smart Study Planner Team. All rights reserved.

This project combines original application code with industry-standard open-source packages. Copyright protection applies to the innovative algorithms, original source code, UI expression, and documentation.

See [COPYRIGHT & INTELLECTUAL PROPERTY](#copyright--intellectual-property) section for details.

---

## Support & Feedback

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation at `/api/docs`

---

**Last Updated:** April 2025
**Version:** 1.0.0
**Status:** Production Ready
