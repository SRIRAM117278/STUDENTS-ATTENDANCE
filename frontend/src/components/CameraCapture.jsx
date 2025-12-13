/**
 * CameraCapture Component
 * Captures face images and extracts face embeddings
 */
import React, { useEffect, useRef, useState } from 'react';
import * as faceService from '../services/faceService';
import useCamera from '../hooks/useCamera';

export default function CameraCapture({ onDescriptorCaptured, captureCount = 5 }) {
  const { videoRef, start, stop, requestPermission } = useCamera();
  const [loadingModels, setLoadingModels] = useState(true);
  const [started, setStarted] = useState(false);
  const [captures, setCaptures] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize and load face-api models
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await faceService.loadFaceApiModels();
        console.log('✓ Face models loaded');
      } catch (err) {
        console.error('✗ Failed to load models:', err);
        if (mounted) setError('Failed to load face recognition models. Please refresh the page.');
      } finally {
        if (mounted) setLoadingModels(false);
      }
    }

    init();
    return () => {
      mounted = false;
      stop();
    };
  }, []);

  // Enable camera and request permission
  const handleEnableCamera = async () => {
    setError(null);
    setMessage('Requesting camera access...');

    try {
      const res = await requestPermission({ video: { facingMode: 'user' } });

      if (res.granted) {
        setStarted(true);
        setMessage('Camera enabled. Ensure good lighting for accurate face detection.');
      } else {
        const err = res.error;
        if (err?.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err?.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera device.');
        } else {
          setError(err?.message || 'Unable to access camera');
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to enable camera');
    }
  };

  // Capture face from video and extract descriptor
  const handleCapture = async () => {
    if (!videoRef.current) return;

    if (loadingModels) {
      setError('Face models are still loading. Please wait...');
      return;
    }

    if (captures.length >= captureCount) {
      setMessage(`Already captured ${captureCount} samples`);
      return;
    }

    setIsCapturing(true);
    setError(null);
    setMessage('Detecting face...');

    try {
      const video = videoRef.current;

      // Wait for video metadata if not ready
      if (!video.videoWidth || !video.videoHeight) {
        await new Promise((resolve) => {
          const onMeta = () => {
            video.removeEventListener('loadedmetadata', onMeta);
            resolve();
          };
          const timeout = setTimeout(resolve, 1000);
          video.addEventListener('loadedmetadata', onMeta);
        });
      }

      // Create canvas from video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = faceService.canvasToBase64(canvas, 0.8);

      // Detect face and extract descriptor
      const result = await faceService.detectSingleFaceDescriptor(canvas);

      if (!result) {
        setError('No face detected. Please ensure your face is clearly visible and well-lit.');
        setIsCapturing(false);
        return;
      }

      const item = {
        image: imageBase64,
        descriptor: result.descriptor
      };

      setCaptures(prev => [...prev, item]);
      onDescriptorCaptured?.(item);
      setMessage(`Captured ${captures.length + 1}/${captureCount} samples`);
    } catch (err) {
      console.error('Capture error:', err);
      setError(`Face detection failed: ${err.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  // Clear captures
  const handleClear = () => {
    setCaptures([]);
    setMessage('');
    setError(null);
  };

  return (
    <div className="space-y-4">
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

      {/* Status Messages */}
      {loadingModels && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          ⏳ Loading face recognition models...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          ✗ {error}
        </div>
      )}

      {message && !error && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          ℹ️ {message}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        {!started ? (
          <button
            onClick={handleEnableCamera}
            disabled={loadingModels}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            🎥 Enable Camera
          </button>
        ) : (
          <>
            <button
              onClick={handleCapture}
              disabled={isCapturing || captures.length >= captureCount || loadingModels}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {isCapturing ? '⏳ Capturing...' : '📷 Capture Face'}
            </button>
            {captures.length > 0 && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Clear
              </button>
            )}
          </>
        )}
      </div>

      {/* Capture Count */}
      {started && (
        <div className="text-sm font-medium text-gray-700">
          Progress: {captures.length}/{captureCount} samples captured
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(captures.length / captureCount) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Captured Images Preview */}
      {captures.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Captured Samples:</p>
          <div className="flex gap-2 overflow-auto pb-2">
            {captures.map((capture, i) => (
              <img
                key={i}
                src={capture.image}
                alt={`Capture ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border-2 border-blue-400 shadow"
                title={`Sample ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}