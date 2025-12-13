// Attendance model - stores attendance records
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  }, // Format: YYYY-MM-DD
  time: { 
    type: String, 
    default: null 
  }, // Format: HH:MM:SS
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Leave'], 
    default: 'Present' 
  },
  // Confidence score from face matching (0-1, lower is better match)
  confidence: { 
    type: Number, 
    default: null 
  },
  // Source: 'auto-face' or 'manual'
  source: { 
    type: String, 
    enum: ['auto-face', 'manual'], 
    default: 'manual' 
  }
}, { timestamps: true });

// Ensure one attendance record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ studentId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
