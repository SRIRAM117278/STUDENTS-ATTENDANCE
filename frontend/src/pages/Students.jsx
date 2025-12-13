/**
 * Students Management Page
 * Shows all enrolled and non-enrolled students
 */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getStudents, deleteStudent } from '../services/studentService';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEnrolled, setFilterEnrolled] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, [filterEnrolled]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterEnrolled === 'enrolled') {
        params.isEnrolled = 'true';
      } else if (filterEnrolled === 'notEnrolled') {
        params.isEnrolled = 'false';
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const data = await getStudents(params);
      setStudents(data);
    } catch (err) {
      console.error('Load error:', err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;

    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s._id !== id));
      toast.success('Student deleted');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👥 Students</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filterEnrolled}
            onChange={e => setFilterEnrolled(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Students</option>
            <option value="enrolled">Enrolled Only</option>
            <option value="notEnrolled">Not Enrolled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Enrolled</p>
          <p className="text-2xl font-bold text-green-600">
            {students.filter(s => s.isEnrolled).length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">Pending Enrollment</p>
          <p className="text-2xl font-bold text-red-600">
            {students.filter(s => !s.isEnrolled).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{student.name}</td>
                  <td className="px-6 py-3">{student.rollNumber}</td>
                  <td className="px-6 py-3">{student.className || '-'}</td>
                  <td className="px-6 py-3">
                    {student.isEnrolled ? (
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                        ✓ Enrolled
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                        ⚠️ Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}