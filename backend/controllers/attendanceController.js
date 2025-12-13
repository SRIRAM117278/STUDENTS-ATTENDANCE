// Attendance controllers: mark attendance, get by date, report
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// Helper function to format date to YYYY-MM-DD string
const formatDate = (d) => new Date(d).toISOString().split('T')[0];

// Helper function to get current time as HH:MM:SS
const getCurrentTime = () => new Date().toTimeString().split(' ')[0];

// Helper function to calculate Euclidean distance between two embeddings
const euclideanDistance = (embedding1, embedding2) => {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    return Infinity;
  }
  
  let sum = 0;
  const length = Math.min(embedding1.length, embedding2.length);
  
  for (let i = 0; i < length; i++) {
    const diff = (Number(embedding1[i]) || 0) - (Number(embedding2[i]) || 0);
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
};

/**
 * @desc    Mark attendance using face recognition
 * @route   POST /api/attendance/mark
 * @access  Public
 * @body    { faceEmbedding: [Number], studentId?, date?, time? }
 */
exports.markAttendance = async (req, res, next) => {
  try {
    const { faceEmbedding, studentId, date, time, status = 'Present' } = req.body;

    const attendanceDate = formatDate(date || new Date());
    const attendanceTime = time || getCurrentTime();

    // Case 1: Manual mark attendance by student ID
    if (studentId && !faceEmbedding) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Check if already marked today
      const existing = await Attendance.findOne({
        studentId: studentId,
        date: attendanceDate
      });

      if (existing) {
        return res.status(400).json({
          message: 'Attendance already marked for this student today',
          existingRecord: existing
        });
      }

      const attendance = await Attendance.create({
        studentId,
        date: attendanceDate,
        time: attendanceTime,
        status,
        source: 'manual'
      });

      return res.status(201).json({
        message: 'Attendance marked manually',
        attendance,
        student: { _id: student._id, name: student.name, rollNumber: student.rollNumber }
      });
    }

    // Case 2: Auto mark attendance using face recognition
    if (faceEmbedding && Array.isArray(faceEmbedding)) {
      const inputEmbedding = faceEmbedding.map(v => Number(v));

      // Get all enrolled students
      const enrolledStudents = await Student.find({
        isEnrolled: true,
        faceEmbedding: { $exists: true, $ne: [] }
      }).select('_id name rollNumber className faceEmbedding');

      if (!enrolledStudents || enrolledStudents.length === 0) {
        return res.status(404).json({
          message: 'No enrolled students found',
          error: 'Please enroll students first before marking attendance'
        });
      }

      // Find best match
      let bestMatch = {
        student: null,
        distance: Infinity,
        confidence: 0
      };

      enrolledStudents.forEach(student => {
        if (!Array.isArray(student.faceEmbedding) || student.faceEmbedding.length === 0) {
          return;
        }

        const distance = euclideanDistance(inputEmbedding, student.faceEmbedding);

        if (distance < bestMatch.distance) {
          bestMatch = {
            student,
            distance,
            confidence: Math.max(0, 1 - (distance / 2)) // Normalize to 0-1
          };
        }
      });

      // Face matching threshold (0.45 to 0.50 is typical for face-api.js descriptors)
      const threshold = Number(process.env.FACE_DISTANCE_THRESHOLD || 0.48);

      if (bestMatch.distance > threshold) {
        return res.status(400).json({
          message: 'No matching face found',
          error: `Best match distance (${bestMatch.distance.toFixed(3)}) exceeds threshold (${threshold})`,
          bestDistance: bestMatch.distance
        });
      }

      // Check if attendance already marked today
      const existing = await Attendance.findOne({
        studentId: bestMatch.student._id,
        date: attendanceDate
      });

      if (existing) {
        return res.status(400).json({
          message: 'Attendance already marked for this student today',
          student: {
            _id: bestMatch.student._id,
            name: bestMatch.student.name,
            rollNumber: bestMatch.student.rollNumber
          },
          existingRecord: existing
        });
      }

      // Create attendance record
      const attendance = await Attendance.create({
        studentId: bestMatch.student._id,
        date: attendanceDate,
        time: attendanceTime,
        status,
        confidence: bestMatch.distance,
        source: 'auto-face'
      });

      return res.status(201).json({
        message: 'Attendance marked successfully',
        attendance,
        student: {
          _id: bestMatch.student._id,
          name: bestMatch.student.name,
          rollNumber: bestMatch.student.rollNumber,
          className: bestMatch.student.className
        },
        matchDistance: bestMatch.distance,
        matchConfidence: bestMatch.confidence
      });
    }

    return res.status(400).json({
      message: 'Invalid request',
      error: 'Either faceEmbedding or studentId is required'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get attendance records by date
 * @route   GET /api/attendance?date=YYYY-MM-DD
 * @access  Public
 */
exports.getAttendanceByDate = async (req, res, next) => {
  try {
    const date = req.query.date
      ? formatDate(req.query.date)
      : formatDate(new Date());

    const records = await Attendance.find({ date })
      .populate('studentId', 'name rollNumber className')
      .sort({ time: -1 });

    const summary = {
      date,
      totalMarked: records.length,
      presentCount: records.filter(r => r.status === 'Present').length,
      absentCount: records.filter(r => r.status === 'Absent').length,
      records
    };

    res.json(summary);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get attendance report with date range
 * @route   GET /api/attendance/report?from=YYYY-MM-DD&to=YYYY-MM-DD&studentId=
 * @access  Public
 */
exports.getReport = async (req, res, next) => {
  try {
    const { from, to, studentId } = req.query;

    const match = {};

    if (from) match.date = { $gte: formatDate(from) };
    if (to) {
      match.date = Object.assign(match.date || {}, { $lte: formatDate(to) });
    }

    if (studentId) {
      match.studentId = require('mongoose').Types.ObjectId(studentId);
    }

    // Aggregate attendance records
    const report = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$studentId',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
          },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 0,
          student: {
            _id: '$student._id',
            name: '$student.name',
            rollNumber: '$student.rollNumber',
            className: '$student.className'
          },
          totalDays: 1,
          presentDays: 1,
          absentDays: 1,
          attendancePercentage: {
            $round: [
              { $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100] },
              2
            ]
          },
          avgConfidence: { $round: ['$avgConfidence', 4] }
        }
      },
      { $sort: { 'student.name': 1 } }
    ]);

    res.json({
      from: from || formatDate(new Date()),
      to: to || formatDate(new Date()),
      totalStudents: report.length,
      report
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single attendance record
 * @route   GET /api/attendance/:id
 * @access  Public
 */
exports.getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('studentId', 'name rollNumber className');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Public
 */
exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    next(err);
  }
};
