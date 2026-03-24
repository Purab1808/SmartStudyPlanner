# 🚀 Smart Study Planner with Mental Load Tracking

A full-stack intelligent study planning system that goes beyond basic scheduling by incorporating **mental fatigue, stress, motivation, sleep, and workload balance**.

This platform helps students plan smarter, avoid burnout, and maintain consistent productivity.

---

## 🌟 Key Idea

Unlike traditional planners, this system dynamically adjusts study schedules based on:

* 🧠 Mental fatigue & recovery
* 📊 Workload distribution
* ⏳ Deadlines & priorities
* 😴 Sleep & motivation levels

---

## 🖼️ Screenshots

<img width="1347" height="898" alt="image" src="https://github.com/user-attachments/assets/79b607e6-a3f1-410f-8111-020d59a96d53" />
<img width="1880" height="906" alt="image" src="https://github.com/user-attachments/assets/a1553cfb-e5f8-4b15-94f8-8e2ee615f104" />

---

## ✨ Features

### 🔐 Authentication

* Email OTP verification
* JWT-based secure login
* Password reset via OTP
* Protected routes
* Profile management
* Account deletion

---

### 📚 Subject Management

* Add / Edit / Delete subjects
* Track difficulty, priority, exam dates
* Estimate study hours

---

### ✅ Task Management

* Create, update, delete tasks
* Mark tasks as completed
* Filter by subject
* Store deadline, priority, difficulty

---

### 🧠 Mental Load Tracking

* Fatigue tracking
* Stress level monitoring
* Motivation logging
* Sleep tracking
* Historical mental data

---

### ⚙️ Smart Scheduling Engine

* Weekly plan generation
* Considers:

  * Deadlines
  * Difficulty
  * Workload
  * Mental fatigue
* Prevents overloading
* Balances study time

---

### 🚨 Overload Detection

* Detects burnout risk
* Flags overloaded days
* Suggests:

  * Task redistribution
  * Rest days

---

### 📊 Analytics Dashboard

* Study hours tracking
* Task completion stats
* Productivity score
* Fatigue trends

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Custom CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer

### Security

* Helmet
* CORS
* Rate Limiting
* Validation Middleware

---

## 📂 Project Structure

```bash
ProjectCopyright/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   └── swagger.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 🚀 Future Improvements

* AI-based personalized study suggestions
* Mobile app integration
* Real-time notifications
* Advanced analytics with ML

---

## 📜 License & Copyright

© 2026 Smart Study Planner. All rights reserved.
This project is proprietary and not allowed for reuse without permission.

---

## 👨‍💻 Author

Purab Vats
