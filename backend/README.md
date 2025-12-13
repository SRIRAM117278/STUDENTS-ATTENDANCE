# Students Attendance Backend

Node + Express + MongoDB backend for Students Attendance Management System.

Setup

1. Copy `.env.example` to `.env` and fill `MONGO_URI`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in dev mode:

```bash
npm run dev
```

API Endpoints

- `POST /api/students` - Create student
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

- `POST /api/attendance` - Mark attendance (supports bulk)
- `GET /api/attendance?date=YYYY-MM-DD` - Get attendance by date
- `GET /api/attendance/report?from=&to=&studentId=` - Attendance reports

