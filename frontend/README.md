# Students Attendance Frontend

This is a Vite React frontend using Tailwind CSS.

Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create `.env` from `.env.example` and set `VITE_API_URL`.

3. Run dev server:

```bash
npm run dev
```

Face-api.js models

The app expects face-api models to be served from `/models` on the client. Download the models (tiny_face_detector, face_landmark_68, face_recognition) and place them under `frontend/public/models/`.

You can download models from the face-api.js repo or CDN. Example:

```text
frontend/public/models/tiny_face_detector_model-weights_manifest.json
frontend/public/models/face_landmark_68_model-weights_manifest.json
frontend/public/models/face_recognition_model-weights_manifest.json
```

Or host models from a CDN and change load paths in `src/services/faceService.js`.

