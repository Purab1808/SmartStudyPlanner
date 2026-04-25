# Smart Study Planner with Mental Load Tracking

A sophisticated full-stack academic planning and productivity system that intelligently combines subject/task management, behavior-aware mental-load estimation, adaptive scheduling algorithms, overload detection, and burnout-risk analytics.

![Smart Study Planner Dashboard](./screenshots/Landing.png)

---

## 📋 Overview

Smart Study Planner helps students plan smarter by:
- **Organizing subjects and tasks** with priority and difficulty tracking
- **Adapting study intensity** to real workload and mental fatigue
- **Preventing burnout** through intelligent workload distribution
- **Tracking wellness** with fatigue, stress, motivation, and sleep insights
- **Generating smart schedules** that balance productivity with recovery

---

## ✨ Key Features

- 🔐 **OTP-based authentication** with JWT security
- 📚 **Subject & Task Management** with priority and difficulty levels
- 🧠 **Mental Load Tracking** (fatigue, stress, motivation, sleep)
- 📅 **Intelligent Scheduling** that adapts to workload and fatigue
- 🚨 **Overload Detection** with actionable warnings
- 📊 **Analytics Dashboard** with burnout risk prediction
- 💾 **MongoDB Database** with secure data storage
- 🎨 **Modern React UI** with Vite and responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18.3, Vite 5.4, React Router, Axios, GSAP |
| **Backend** | Node.js, Express.js 4.19, MongoDB, Mongoose |
| **Security** | JWT, bcryptjs, Helmet, CORS, Rate Limiting |
| **Testing** | Jest, Supertest, MongoDB Memory Server |

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+ with npm
- MongoDB Atlas account (free tier available)
- Git

### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure `.env`:**
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/smart-study-planner?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
OTP_HASH_SECRET=your_super_secret_otp_key_min_32_chars
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
SMTP_PASS=your_gmail_app_password
SMTP_FROM_NAME=Smart Study Planner
```

**Start Backend:**
```bash
npm run dev
```
Backend: `http://localhost:5001`  
API Docs: `http://localhost:5001/api/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Configure `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Start Frontend:**
```bash
npm run dev
```
Frontend: `http://localhost:5173`

---

## 🔑 Required Environment Variables

### Backend `.env`

| Variable | Purpose |
|----------|---------|
| `PORT` | Backend port (5001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | 32+ char random secret for token signing |
| `OTP_HASH_SECRET` | 32+ char random secret for OTP hashing |
| `CLIENT_URL` | Frontend URL (http://localhost:5173) |
| `SMTP_USER` | Gmail address for email |
| `SMTP_PASS` | Gmail app password (not regular password) |

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 📊 Main API Endpoints

### Authentication
```
POST   /api/auth/register/request-otp
POST   /api/auth/register/verify-otp
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
```

### Subjects
```
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

### Tasks
```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/complete
```

### Mental Load
```
GET    /api/mental-load
POST   /api/mental-load
```

### Schedule
```
POST   /api/schedule/generate
GET    /api/schedule
GET    /api/schedule/:date
```

### Analytics
```
GET    /api/analytics/summary
GET    /api/analytics/fatigue-trend
GET    /api/analytics/productivity
GET    /api/analytics/burnout-risk
```

---

## 📁 Project Structure

```
ProjectCopyright/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── tests/           # Jest tests
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Global state
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
└── README.md
```

---

## 🧪 Testing

```bash
cd backend
npm test
npm run test:watch
npm test -- auth.test.js
```

---

## 🚀 How It Works

1. **Register** → Email OTP verification
2. **Add Subjects** → Priority and credit hours
3. **Create Tasks** → Difficulty level and deadline
4. **Daily Check-in** → Log fatigue and sleep
5. **Generate Schedule** → Adaptive based on fatigue and workload
6. **Monitor Alerts** → Overload warnings
7. **View Analytics** → Burnout risk and productivity trends

---

## 🔒 Copyright & License

© 2024-2025 Smart Study Planner. All rights reserved.

**Protected:**
- ✅ Original source code (backend & frontend)
- ✅ Unique algorithms (scheduling, burnout prediction, mental state estimation)
- ✅ UI/UX design and database schemas

**Usage:**
- ✅ Educational & personal use
- ❌ Commercial use without permission
- ❌ Redistribute without attribution

---

## 🔧 Troubleshooting

**Port Already in Use:**
```bash
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**MongoDB Connection Failed:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas cluster is active
- Whitelist your IP in MongoDB Atlas

**Email Not Sending:**
- Enable 2FA on Gmail
- Use Gmail App Password (not regular password)
- Verify `SMTP_USER` and `SMTP_PASS`

**CORS Errors:**
- Backend: `CLIENT_URL=http://localhost:5173`
- Frontend: `VITE_API_BASE_URL=http://localhost:5001/api`

---

**Version:** 1.0.0 | **Status:** Production Ready | **Updated:** April 2025
