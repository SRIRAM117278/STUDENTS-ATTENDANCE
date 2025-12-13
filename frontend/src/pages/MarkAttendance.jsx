/**
 * Mark Attendance Page
 * Allows students to mark attendance using face recognition
 */
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import * as faceService from '../services/faceService';
import { markAttendance } from '../services/attendanceService';
import { getEnrolledStudents } from '../services/studentService';
import useCamera from '../hooks/useCamera';

export default function MarkAttendance() {
  const { videoRef, requestPermission } = useCamera();
  const canvasRef = useRef(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [lastMarked, setLastMarked] = useState(null);

  // Load models and enrolled students
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Load face models
        await faceService.loadFaceApiModels();

        // Load enrolled students
        const students = await getEnrolledStudents();
        if (mounted) {
          setEnrolledStudents(students);
          console.log(`✓ Loaded ${students.length} enrolled students`);
        }
      } catch (err) {
        console.error('Init error:', err);
        if (mounted) setError('Failed to initialize. Please refresh.');
      } finally {
        if (mounted) setLoadingModels(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Enable camera
  const handleEnableCamera = async () => {
    setError(null);
    setMessage('Requesting camera access...');

    try {
      const res = await requestPermission({ video: { facingMode: 'user' } });

      if (res.granted) {
        setStarted(true);
        setMessage('Camera enabled. Position your face in the center.');
        startDetection();
      } else {
        setError('Camera permission denied');
      }
    } catch (err) {
      setError(err.message || 'Failed to enable camera');
    }
  };

  // Continuous face detection
  const startDetection = async () => {
    if (!videoRef.current) return;

    const detect = async () => {
      if (!started) return;

      try {
        const video = videoRef.current;

        if (!video.videoWidth || !video.videoHeight) {
          requestAnimationFrame(detect);
          return;
        }

        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Detect faces
        const result = await faceService.detectSingleFaceDescriptor(canvas);

        if (result) {
          setMessage('✓ Face detected. Marking attendance...');
          setDetecting(true);

          try {
            // Find matching student
            const match = faceService.findBestMatch(
              result.descriptor,
              enrolledStudents,
              0.48
            );

            if (match) {
              // Mark attendance
              const response = await markAttendance({
                faceEmbedding: result.descriptor,
                studentId: match.student._id
              });

              setLastMarked(match.student);
              setMessage(`✓ Attendance marked for ${match.student.name}`);
              toast.success(`Attendance marked: ${match.student.name}`);
              setDetecting(false);

              // Stop detection after successful mark
              setStarted(false);
            } else {
              setMessage('⚠️ Face detected but no match found. Try getting closer.');
            }
          } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            if (errMsg.includes('already marked')) {
              setMessage(`⚠️ ${errMsg}`);
              toast.error(errMsg);
            } else {
              setMessage(`❌ Error: ${errMsg}`);
            }
            setDetecting(false);
          }
        }

        requestAnimationFrame(detect);
      } catch (err) {
        console.error('Detection error:', err);
        requestAnimationFrame(detect);
      }
    };

    requestAnimationFrame(detect);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📍 Mark Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Models Loading */}
        {loadingModels && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            ⏳ Loading face recognition models...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ✗ {error}
          </div>
        )}

        {/* Status Message */}
        {message && !error && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('✓')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Enrolled Students Count */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          <p><strong>Enrolled Students:</strong> {enrolledStudents.length}</p>
        </div>

        {/* Video Preview */}
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Hidden Canvas for processing */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Controls */}
        <div className="flex gap-2">
          {!started ? (
            <button
              onClick={handleEnableCamera}
              disabled={loadingModels}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              🎥 Start Attendance
            </button>
          ) : (
            <button
              onClick={() => setStarted(false)}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              ⏹️ Stop
            </button>
          )}
        </div>

        {/* Last Marked */}
        {lastMarked && (
          <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Last Marked Attendance:</p>
            <div className="text-lg font-semibold text-green-700">
              ✓ {lastMarked.name}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Roll: {lastMarked.rollNumber} | Class: {lastMarked.className}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">📋 Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Enable camera and position your face in the center</li>
            <li>Ensure good lighting for accurate recognition</li>
            <li>System will automatically detect and mark attendance</li>
            <li>Duplicate attendance cannot be marked same day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}