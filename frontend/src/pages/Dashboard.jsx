/**
 * Attendance Dashboard Page
 * Shows today's attendance summary
 */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAttendanceByDate } from '../services/attendanceService';
import { getStudents } from '../services/studentService';

export default function Dashboard() {
  const [attendance, setAttendance] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attData, studData] = await Promise.all([
        getAttendanceByDate(selectedDate),
        getStudents()
      ]);

      setAttendance(attData);
      setStudents(studData);
    } catch (err) {
      console.error('Load error:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const presentStudents = attendance?.records?.filter(
    r => r.status === 'Present'
  ) || [];
  const absentStudents = students.filter(
    s => !attendance?.records?.some(r => r.studentId._id === s._id)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Attendance Dashboard</h1>

      {/* Date Selector */}
      <div className="mb-6 flex gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Today
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow border-2 border-green-300">
          <p className="text-gray-600 text-sm mb-1">Present</p>
          <p className="text-3xl font-bold text-green-600">
            {presentStudents.length}
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow border-2 border-red-300">
          <p className="text-gray-600 text-sm mb-1">Absent</p>
          <p className="text-3xl font-bold text-red-600">
            {absentStudents.length}
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roll</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Class</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {/* Present Students */}
            {presentStudents.map(record => (
              <tr key={record._id} className="border-b hover:bg-green-50">
                <td className="px-6 py-3">{record.studentId.name}</td>
                <td className="px-6 py-3">{record.studentId.rollNumber}</td>
                <td className="px-6 py-3">{record.studentId.className || '-'}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                    ✓ Present
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {record.time || '-'}
                </td>
              </tr>
            ))}

            {/* Absent Students */}
            {absentStudents.map(student => (
              <tr key={student._id} className="border-b hover:bg-red-50">
                <td className="px-6 py-3">{student.name}</td>
                <td className="px-6 py-3">{student.rollNumber}</td>
                <td className="px-6 py-3">{student.className || '-'}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                    ✗ Absent
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">-</td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No students enrolled yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}