# Students Attendance Management (MERN) with Face Recognition

This project contains a backend (Express + MongoDB) and a Vite React frontend using face-api.js for browser-side face recognition.

Quick start

```bash
# from project root
npm install
# install root dev deps
npm run dev
```

Or start separately:

```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
```

Privacy & models

- Face descriptors (numeric embeddings) are stored on the server; storing raw images is optional and controlled by `STORE_IMAGES` in backend .env.
- Place face-api.js models in `frontend/public/models/` or host via CDN and update `src/services/faceService.js`.

