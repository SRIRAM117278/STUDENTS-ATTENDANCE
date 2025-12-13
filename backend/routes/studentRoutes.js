const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');

// Validation rules
const studentValidators = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('rollNumber').notEmpty().trim().withMessage('Roll number is required'),
];

// Student CRUD routes
router.post('/', studentValidators, studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/enrolled/list', studentController.getEnrolledStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentValidators, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Face enrollment routes
router.post('/enroll', studentController.enrollFace);

module.exports = router;
