# Smart Study Planner Frontend

Original React frontend for the Smart Study Planner with Mental Load Tracking backend.

## Run

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set [frontend/.env.example](/c:/Users/purab/OneDrive/Desktop/ProjectCopyright/frontend/.env.example) to your backend:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## Pages

- Login and Register
- Dashboard overview
- Subjects management
- Task manager
- Mental-load tracker
- Smart schedule planner
- Analytics dashboard

## UI Layout Structure

Dashboard

```text
+---------------- Sidebar ----------------+-------------------- Main --------------------+
| Brand / navigation / logout             | Header + overview stats                      |
| Dashboard                               | Upcoming deadlines        Mental load ring   |
| Subjects                                | Weekly schedule preview                      |
| Tasks                                   |                                              |
| Mental Load                             |                                              |
| Schedule                                |                                              |
| Analytics                               |                                              |
+-----------------------------------------+----------------------------------------------+
```

Schedule

```text
+---------------- Generator ----------------+---------------- Overload Warnings ----------+
| Start date                               | Daily analysis cards                         |
| Planning days                            | Suggestions and workload levels              |
| Daily study time                         |                                              |
| Generate                                 |                                              |
+------------------------------------------+----------------------------------------------+
| Weekly planner board with one card per day                                     |
+---------------------------------------------------------------------------------+
```

Analytics

```text
+---------------- KPI stats ---------------+
| Study hours | Completed | Daily avg | Productivity |
+------------------------------------------+
| Fatigue trend line        | Circular wellbeing summary |
+--------------------------------------------------------+
| Productivity summary bars                               |
+--------------------------------------------------------+
```
