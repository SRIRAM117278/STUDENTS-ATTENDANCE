/**
 * Attendance Service
 * API calls for marking and retrieving attendance
 */
import api from './api';

/**
 * Mark attendance with face recognition or manual entry
 * @param {Object} payload - { faceEmbedding?, studentId?, date?, time?, status? }
 */
export const markAttendance = (payload) =>
  api.post('/attendance/mark', payload).then(r => r.data);

/**
 * Get attendance for a specific date
 * @param {string} date - Format: YYYY-MM-DD
 */
export const getAttendanceByDate = (date) =>
  api.get('/attendance', { params: { date } }).then(r => r.data);

/**
 * Get attendance report for date range
 * @param {Object} params - { from, to, studentId }
 */
export const getReport = (params = {}) =>
  api.get('/attendance/report', { params }).then(r => r.data);

/**
 * Get single attendance record
 */
export const getAttendanceRecord = (id) =>
  api.get(`/attendance/${id}`).then(r => r.data);

/**
 * Delete attendance record
 */
export const deleteAttendance = (id) =>
  api.delete(`/attendance/${id}`).then(r => r.data);

export default {
  markAttendance,
  getAttendanceByDate,
  getReport,
  getAttendanceRecord,
  deleteAttendance
};
