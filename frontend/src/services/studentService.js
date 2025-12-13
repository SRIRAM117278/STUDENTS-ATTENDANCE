/**
 * Student Service
 * API calls for student management and face enrollment
 */
import api from './api';

/**
 * Get all students
 * @param {Object} params - Query parameters (search, className, isEnrolled)
 */
export const getStudents = (params = {}) =>
  api.get('/students', { params }).then(r => r.data);

/**
 * Get enrolled students only
 */
export const getEnrolledStudents = () =>
  api.get('/students/enrolled/list').then(r => r.data);

/**
 * Get single student by ID
 */
export const getStudent = (id) =>
  api.get(`/students/${id}`).then(r => r.data);

/**
 * Create new student
 * @param {Object} data - { name, rollNumber, className }
 */
export const createStudent = (data) =>
  api.post('/students', data).then(r => r.data);

/**
 * Update student
 * @param {string} id - Student ID
 * @param {Object} data - Updated fields
 */
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then(r => r.data);

/**
 * Delete student
 */
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then(r => r.data);

/**
 * Enroll student face
 * @param {Object} payload - { studentId, faceEmbedding: [128 numbers], faceImage: base64 }
 */
export const enrollFace = (payload) =>
  api.post('/students/enroll', payload).then(r => r.data);

export default {
  getStudents,
  getStudent,
  getEnrolledStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollFace
};
