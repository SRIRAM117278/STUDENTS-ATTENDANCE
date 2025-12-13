# 👨‍🎓 Student Attendance System - Complete Guide

## 📋 Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) student attendance system with **real-time face recognition** using face-api.js.

### Features
- ✅ Face enrollment (capture & store student face embeddings)
- ✅ Automated attendance marking via face recognition
- ✅ Real-time face detection from webcam
- ✅ Attendance dashboard & reports
- ✅ Student management
- ✅ Duplicate attendance prevention
- ✅ Pre-loaded sample data (10 Indian students)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally or connection string ready
- Modern browser with webcam support
- Windows 10/11

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo MONGO_URI=mongodb://localhost:27017/attendance > .env
echo PORT=5000 >> .env

# Seed database with sample students
node seed.js

# Start server
npm run dev  # for development with nodemon
# OR
npm start   # for production
```

Server will run on `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:5000/api > .env.local

# Start dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3️⃣ Download Face Models

Face-api.js requires pre-trained models. Create the `/public/models` folder and download:

```bash
cd frontend/public

# Create models directory
mkdir models

# Download these files from:
# https://github.com/vladmandic/face-api/tree/master/model

# Files needed:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-weights_shard1
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model-weights_shard1
# - face_recognition_model-weights_manifest.json
# - face_recognition_model-weights_shard1
```

**OR** automatically download via script (add to package.json):

```json
{
  "scripts": {
    "download-models": "node scripts/download-models.js"
  }
}
```

---

## 📖 Usage

### 1. Enroll Students

1. Go to **"Enroll"** page
2. Select or create a new student
3. Click **"Enable Camera"**
4. Capture 3-5 face samples from different angles
5. Click **"Enroll Face"** to save

### 2. Mark Attendance

1. Go to **"Mark Attendance"** page
2. Click **"Start Attendance"**
3. Face recognition will auto-detect and mark attendance
4. Toast notification confirms: "Attendance marked for [Name]"

### 3. View Dashboard

- **Dashboard**: See today's attendance (present/absent)
- **Reports**: View attendance statistics by date range
- **Students**: Manage student list

---

## 🔧 API Endpoints

### Students
```
POST   /api/students                    # Create student
GET    /api/students                    # Get all students
GET    /api/students/:id                # Get single student
PUT    /api/students/:id                # Update student
DELETE /api/students/:id                # Delete student
GET    /api/students/enrolled/list      # Get enrolled students only
POST   /api/students/enroll             # Enroll face
```

### Attendance
```
POST   /api/attendance/mark             # Mark attendance (auto-face or manual)
GET    /api/attendance?date=YYYY-MM-DD  # Get attendance by date
GET    /api/attendance/report           # Get report (with date range)
GET    /api/attendance/:id              # Get single record
DELETE /api/attendance/:id              # Delete record
```

---

## 📊 Database Models

### Student
```javascript
{
  name: String,
  rollNumber: String (unique),
  className: String,
  faceImage: String,           // Base64 or URL
  faceEmbedding: [Number],     // 128-dimensional array
  isEnrolled: Boolean,
  enrolledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance
```javascript
{
  studentId: ObjectId (ref: Student),
  date: String (YYYY-MM-DD),
  time: String (HH:MM:SS),
  status: String (enum: Present, Absent, Leave),
  confidence: Number,          // Distance score (0-1)
  source: String (auto-face / manual),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# .env
MONGO_URI=mongodb://localhost:27017/attendance
PORT=5000
FACE_DISTANCE_THRESHOLD=0.48          # Face matching threshold (0.45-0.50)
STORE_IMAGES=false                    # Store captured images on server
NODE_ENV=development
```

### Frontend Environment Variables

```env
# .env.local
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Issue: "Failed to load models"
- Ensure models are in `/frontend/public/models`
- Check browser console for exact error
- Verify models directory permissions

### Issue: "No face detected"
- Ensure good lighting
- Position face clearly in camera center
- Reduce distance from camera
- Refresh page and try again

### Issue: Face not matching
- Enroll with different angles/lighting
- Lower threshold in `.env`: `FACE_DISTANCE_THRESHOLD=0.45`
- Check enrolled students: GET `/api/students/enrolled/list`

### Issue: Attendance already marked
- Each student can only mark once per day
- Delete record via API if needed: DELETE `/api/attendance/:id`

### Issue: Camera permission denied
- Allow camera in browser address bar
- Check site permissions in browser settings
- Restart browser

---

## 📁 Project Structure

```
students attendance/
├── backend/
│   ├── config/           # Database config
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── seed.js           # Database seeding
│   ├── server.js         # Express app
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── models/       # Face-api.js models (download required)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🎨 Sample Students (Pre-loaded)

Database includes 10 Indian students:

1. Aarav Sharma (Roll: 001) - Class 10A
2. Priya Reddy (Roll: 002) - Class 10A
3. Kunal Mehta (Roll: 003) - Class 10A
4. Divya Nair (Roll: 004) - Class 10B
5. Rohan Kumar (Roll: 005) - Class 10B
6. Sneha Patil (Roll: 006) - Class 10B
7. Abhinav Singh (Roll: 007) - Class 10C
8. Meera Joshi (Roll: 008) - Class 10C
9. Varun Gupta (Roll: 009) - Class 10C
10. Harini Iyer (Roll: 010) - Class 10A

These have mock face embeddings for demonstration. **Replace with actual face data** when enrolling real students.

---

## 🔐 Security Notes

- Face embeddings are stored in MongoDB (not reversible to images)
- Attendance records include confidence scores for audit
- Duplicate attendance is prevented (one record per student per day)
- No authentication currently - add JWT/sessions for production

---

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express-validator` - Input validation

### Frontend
- `react` - UI library
- `axios` - HTTP client
- `face-api.js` - Face recognition
- `react-hot-toast` - Notifications
- `tailwindcss` - Styling
- `vite` - Build tool

---

## 🚀 Deployment

### Backend (Node.js)
```bash
# Production build
NODE_ENV=production npm start

# Using PM2
npm install -g pm2
pm2 start server.js --name "attendance-api"
pm2 logs attendance-api
```

### Frontend (Static)
```bash
# Build for production
npm run build

# Output: dist/
# Deploy to: Vercel, Netlify, GitHub Pages, AWS S3, etc.
```

---

## 📝 License

MIT

---

## ✅ Checklist Before Going Live

- [ ] MongoDB connection verified
- [ ] Face-api models downloaded
- [ ] Environment variables configured
- [ ] Students enrolled with real faces
- [ ] Tested face recognition on multiple students
- [ ] Tested on different lighting conditions
- [ ] Tested duplicate attendance prevention
- [ ] Reports generating correctly
- [ ] Backend CORS configured for production domain

---

## 📞 Support

For issues or questions, check:
1. Browser console for errors
2. Backend logs (`npm run dev`)
3. MongoDB connection
4. API endpoints via Postman

**Happy Attendance Taking!** 🎉
