## 🚀 QUICK START (Windows 10)

### Prerequisites
- Node.js v16+ installed: https://nodejs.org
- MongoDB running locally OR connection string ready
- Modern browser (Chrome/Edge) with webcam

---

## Step 1: Backend Setup (5 min)

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/attendance
# PORT=5000

# Seed database with 10 sample students
node seed.js

# Start server (keep running)
npm run dev
```

**Expected output**: `Server running on port 5000`

---

## Step 2: Frontend Setup (5 min)

**In new terminal:**

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local with:
# VITE_API_URL=http://localhost:5000/api

# Start dev server (keep running)
npm run dev
```

**Expected output**: `http://localhost:5173`

---

## Step 3: Download Face Models (Important!)

Face recognition requires 3 model files. Download from:
https://github.com/vladmandic/face-api/tree/master/model

Create folder: `frontend/public/models`

Download these 6 files to `frontend/public/models`:
1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-weights_shard1`
3. `face_landmark_68_model-weights_manifest.json`
4. `face_landmark_68_model-weights_shard1`
5. `face_recognition_model-weights_manifest.json`
6. `face_recognition_model-weights_shard1`

---

## Step 4: Open Application

1. Open browser: `http://localhost:5173`
2. You should see login page/dashboard

---

## ✅ Testing Flow

### Test 1: Check Sample Students
1. Go to **Students** page
2. You should see 10 pre-loaded students (Aarav Sharma, Priya Reddy, etc.)
3. Status should show "Enrolled" for all

### Test 2: Try Enrollment
1. Go to **Enroll** page
2. Create new student: "Test Student" / Roll "999" / Class "Test"
3. Enable camera and capture 3 face samples
4. Click "Enroll Face"
5. Should see success toast

### Test 3: Mark Attendance
1. Go to **Mark Attendance** page
2. Click "Start Attendance"
3. Position your face in camera
4. System should detect and mark attendance automatically
5. You'll see: "Attendance marked for [Your Name]"

### Test 4: View Dashboard
1. Go to **Dashboard** page
2. Should see attendance for today
3. Check Present/Absent counts

### Test 5: View Reports
1. Go to **Reports** page
2. Select date range (last 7 days)
3. Should see attendance percentage per student

---

## 🐛 Troubleshooting

### "Failed to load models"
→ Check `frontend/public/models` folder has 6 files
→ Refresh page
→ Check browser console for exact error

### "No face detected"
→ Ensure good lighting (bright room)
→ Face should be 30-60cm from camera
→ Center face in camera view
→ Try again with better positioning

### "Cannot connect to API"
→ Check backend is running: `http://localhost:5000`
→ Check `VITE_API_URL` in `frontend/.env.local`
→ Check CORS in backend (should be enabled by default)

### "MongoDB connection failed"
→ Start MongoDB: `mongod` (Windows cmd)
→ OR check MongoDB Atlas connection string
→ Update `MONGO_URI` in `backend/.env`

### Camera not working
→ Allow camera permission in browser
→ Check browser privacy settings
→ Restart browser
→ Try different browser (Chrome recommended)

---

## 📱 API Testing (Optional)

Test backend API with curl/Postman:

```bash
# Get sample students
curl http://localhost:5000/api/students

# Get today's attendance
curl "http://localhost:5000/api/attendance?date=2024-12-12"

# Get attendance report
curl "http://localhost:5000/api/attendance/report"
```

---

## 📂 Project Structure

```
students attendance/
├── backend/           ← Run: npm run dev
├── frontend/          ← Run: npm run dev
├── SETUP_GUIDE.md     ← Full documentation
├── CHANGES_APPLIED.md ← What was fixed
└── README.md
```

---

## ⚡ Common Commands

```bash
# Backend
cd backend
npm run dev           # Development mode with nodemon
npm start            # Production mode
node seed.js         # Populate database

# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Terminal shortcuts (Linux/Mac)
npm install          # Install dependencies
npm update           # Update packages
npm list             # List installed packages
```

---

## 🎯 Success Indicators

✅ Backend running on `http://localhost:5000`
✅ Frontend running on `http://localhost:5173`
✅ Can see 10 sample students in database
✅ Can create new student
✅ Can capture face images
✅ Can enroll faces
✅ Camera detection shows live feedback
✅ Attendance marked automatically
✅ Dashboard shows attendance
✅ Reports display statistics

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check terminal logs (backend and frontend)
3. Read `SETUP_GUIDE.md` for detailed guide
4. Check `CHANGES_APPLIED.md` for what was fixed
5. Verify all 3 steps above are complete

---

## 🎉 You're Ready!

Your Student Attendance System is ready to use!

Start with Enroll page → Mark Attendance page → Check Dashboard

Enjoy! 👨‍🎓
