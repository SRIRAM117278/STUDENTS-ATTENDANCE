// Student controllers: CRUD operations and face enrollment
const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create a new student (basic profile without face)
 * @route   POST /api/students
 * @access  Public
 */
exports.createStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, rollNumber, className } = req.body;
    if (!name || !rollNumber) {
      return res.status(400).json({ message: 'name and rollNumber are required' });
    }

    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      className: className || '',
      isEnrolled: false
    });

    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all students with optional search/filter
 * @route   GET /api/students?search=&className=&isEnrolled=
 * @access  Public
 */
exports.getStudents = async (req, res, next) => {
  try {
    const { search, className, isEnrolled } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { rollNumber: new RegExp(search, 'i') },
        { className: new RegExp(search, 'i') }
      ];
    }

    if (className) query.className = className;
    if (typeof isEnrolled !== 'undefined') {
      query.isEnrolled = isEnrolled === 'true';
    }

    const students = await Student.find(query).sort({ name: 1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update student details
 * @route   PUT /api/students/:id
 * @access  Public
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Public
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete uploaded images
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'students', req.params.id);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Enroll student face: capture face image and embedding
 * @route   POST /api/students/enroll
 * @access  Public
 * @body    { studentId, faceEmbedding: [Number], faceImage: base64String }
 */
exports.enrollFace = async (req, res, next) => {
  try {
    const { studentId, faceEmbedding, faceImage } = req.body;

    // Validation
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    if (!faceEmbedding || !Array.isArray(faceEmbedding) || faceEmbedding.length === 0) {
      return res.status(400).json({ 
        message: 'No face detected',
        error: 'Face embedding array is missing or empty'
      });
    }

    if (faceEmbedding.length !== 128) {
      return res.status(400).json({
        message: 'Invalid face embedding dimension',
        expected: 128,
        received: faceEmbedding.length
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Store the face embedding (normalized to numbers)
    student.faceEmbedding = faceEmbedding.map(v => Number(v));

    // Save face image if provided
    if (faceImage && typeof faceImage === 'string') {
      const matches = faceImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        try {
          const uploadsDir = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            'students'
          );
          fs.mkdirSync(uploadsDir, { recursive: true });

          const ext = (matches[1].split('/')[1]) || 'jpg';
          const filename = `${student._id}-face-${Date.now()}.${ext}`;
          const filepath = path.join(uploadsDir, filename);

          const base64Data = matches[2];
          fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));

          student.faceImage = `/uploads/students/${filename}`;
        } catch (err) {
          console.error('Error saving face image:', err);
        }
      }
    }

    // Mark as enrolled
    student.isEnrolled = true;
    student.enrolledAt = new Date();

    await student.save();

    res.status(200).json({
      message: 'Face enrollment successful',
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        className: student.className,
        isEnrolled: student.isEnrolled,
        faceImage: student.faceImage,
        embeddingDimension: student.faceEmbedding.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get enrolled students only
 * @route   GET /api/students/enrolled/list
 * @access  Public
 */
exports.getEnrolledStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isEnrolled: true }).select(
      'name rollNumber className faceEmbedding faceImage'
    );
    res.json(students);
  } catch (err) {
    next(err);
  }
};
