const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');

// Routes for attendance management
router.post('/mark', attendanceController.markAttendance);
router.get('/', attendanceController.getAttendanceByDate);
router.get('/report', attendanceController.getReport);
router.get('/:id', attendanceController.getAttendanceById);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
