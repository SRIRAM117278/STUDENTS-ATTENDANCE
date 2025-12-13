#!/bin/bash
# Complete Installation Script for Student Attendance System
# Run: bash install.sh

set -e

echo "================================"
echo "Student Attendance System Setup"
echo "================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
node -v || (echo "Node.js not installed. Download from https://nodejs.org"; exit 1)

# Backend Setup
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/attendance
PORT=5000
FACE_DISTANCE_THRESHOLD=0.48
STORE_IMAGES=false
NODE_ENV=development
EOF
    echo ".env created. Please update MONGO_URI if using MongoDB Atlas."
fi

echo "✓ Backend setup complete"

# Frontend Setup
echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

# Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo ".env.local created"
fi

echo "✓ Frontend setup complete"

# Instructions
echo ""
echo "================================"
echo "✅ Installation Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Download face-api.js models:"
echo "   - Create: frontend/public/models"
echo "   - Download models from: https://github.com/vladmandic/face-api/tree/master/model"
echo "   - Place 6 files in frontend/public/models"
echo ""
echo "2. Start MongoDB (if local):"
echo "   - Windows: mongod"
echo "   - macOS/Linux: brew services start mongodb-community"
echo ""
echo "3. Seed database with sample students:"
echo "   cd backend && node seed.js"
echo ""
echo "4. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "5. Start Frontend (new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "6. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "================================"
