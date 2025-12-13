/**
 * Enroll Page
 * Allows teachers to enroll new students with face recognition
 */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getStudents, createStudent, enrollFace } from '../services/studentService';
import CameraCapture from '../components/CameraCapture';

export default function Enroll() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('');

  // Load all students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents({ isEnrolled: false });
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Create new student
  const handleCreateStudent = async () => {
    if (!name || !rollNumber) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const student = await createStudent({
        name,
        rollNumber,
        className: className || ''
      });

      setStudents(prev => [...prev, student]);
      setSelectedStudentId(student._id);
      setName('');
      setRollNumber('');
      setClassName('');
      toast.success(`Student ${student.name} created`);
    } catch (err) {
      console.error('Create student error:', err);
      toast.error(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  // Handle captured face descriptor
  const handleDescriptorCaptured = (item) => {
    setCaptures(prev => [...prev, item]);
  };

  // Enroll captured faces
  const handleEnroll = async () => {
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    if (captures.length === 0) {
      toast.error('Please capture at least one face sample');
      return;
    }

    try {
      setEnrolling(true);

      // Compute mean embedding from all captures
      const descriptors = captures.map(c => c.descriptor);
      const meanDescriptor = descriptors[0].slice();

      for (let i = 1; i < descriptors.length; i++) {
        for (let j = 0; j < meanDescriptor.length; j++) {
          meanDescriptor[j] += descriptors[i][j];
        }
      }

      for (let j = 0; j < meanDescriptor.length; j++) {
        meanDescriptor[j] /= descriptors.length;
      }

      // Prepare enrollment data
      const enrollData = {
        studentId: selectedStudentId,
        faceEmbedding: meanDescriptor,
        faceImage: captures[0].image // Send first capture as face image
      };

      // Send to backend
      const response = await enrollFace(enrollData);

      toast.success('✓ Face enrollment successful!');

      // Refresh student list
      setCaptures([]);
      setSelectedStudentId('');
      await loadStudents();
    } catch (err) {
      console.error('Enrollment error:', err);
      toast.error(err.response?.data?.message || 'Failed to enroll face');
    } finally {
      setEnrolling(false);
    }
  };

  const selectedStudent = students.find(s => s._id === selectedStudentId);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👨‍🎓 Enroll Student Face</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📋 Select Student</h2>

            {/* Student Dropdown */}
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>

            {selectedStudent && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Roll:</strong> {selectedStudent.rollNumber}</p>
                <p><strong>Class:</strong> {selectedStudent.className || '-'}</p>
              </div>
            )}
          </div>

          {/* Create New Student Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">➕ Create New Student</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Class (e.g., 10A)"
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCreateStudent}
                disabled={loading || !name || !rollNumber}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
              >
                {loading ? '⏳ Creating...' : '✓ Create Student'}
              </button>
            </div>
          </div>
        </div>

        {/* Camera Capture */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📷 Capture Face Samples</h2>
            <p className="text-sm text-gray-600 mb-4">
              Capture 3-5 clear photos from different angles. Ensure good lighting and center your face.
            </p>

            <CameraCapture
              onDescriptorCaptured={handleDescriptorCaptured}
              captureCount={5}
            />
          </div>

          {/* Enrollment Summary */}
          {captures.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">📊 Enrollment Summary</h3>

              <div className="space-y-2 text-sm mb-4">
                <p><strong>Student:</strong> {selectedStudent?.name || 'Not selected'}</p>
                <p><strong>Captured Samples:</strong> {captures.length}/5</p>
                <p><strong>Embedding Dimension:</strong> 128 (face-api.js)</p>
              </div>

              <button
                onClick={handleEnroll}
                disabled={enrolling || !selectedStudentId}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
              >
                {enrolling ? '⏳ Enrolling...' : '✓ Enroll Face'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}