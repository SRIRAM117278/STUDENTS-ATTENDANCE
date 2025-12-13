// Student model - stores student details and face embeddings
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  className: { 
    type: String, 
    default: '' 
  },
  // Face image: base64 or URL
  faceImage: { 
    type: String, 
    default: '' 
  },
  // Face embedding array from face-api.js (128 dimensions)
  faceEmbedding: { 
    type: [Number], 
    default: [] 
  },
  // Legacy support for multiple embeddings
  faceEmbeddings: { 
    type: [[Number]], 
    default: [] 
  },
  // Enrollment status
  isEnrolled: { 
    type: Boolean, 
    default: false 
  },
  enrolledAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

// Index for faster queries
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ isEnrolled: 1 });

module.exports = mongoose.model('Student', studentSchema);
