/**
 * Face Recognition Service
 * Handles face-api.js model loading and face detection operations
 */
import * as faceapi from 'face-api.js';

// ===== Model Loading =====

/**
 * Load all required face-api.js models
 * Models must be in /public/models directory
 */
export async function loadFaceApiModels() {
  try {
    const MODEL_URL = '/models';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    
    console.log('✓ All face-api models loaded successfully');
    return true;
  } catch (err) {
    console.error('✗ Failed to load face-api models:', err);
    throw new Error(`Failed to load face models: ${err.message}`);
  }
}

/**
 * Check if models are loaded
 */
export function areModelsLoaded() {
  try {
    return (
      faceapi.nets.tinyFaceDetector.isLoaded() &&
      faceapi.nets.faceLandmark68Net.isLoaded() &&
      faceapi.nets.faceRecognitionNet.isLoaded()
    );
  } catch {
    return false;
  }
}

// ===== Face Detection =====

/**
 * Detect a single face in a canvas and return descriptor (embedding)
 * @param {HTMLCanvasElement} canvas - Canvas element with image data
 * @returns {Object} { detection, descriptor: [128 numbers] } or null
 */
export async function detectSingleFaceDescriptor(canvas) {
  try {
    if (!canvas) throw new Error('Canvas element is required');

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.4
    });

    const detection = await faceapi
      .detectSingleFace(canvas, options)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return null;
    }

    return {
      detection,
      descriptor: Array.from(detection.descriptor)
    };
  } catch (err) {
    console.error('Face detection error:', err);
    throw err;
  }
}

/**
 * Detect all faces in a canvas and return descriptors
 * @param {HTMLCanvasElement} canvas - Canvas element with image data
 * @returns {Array} Array of { detection, descriptor }
 */
export async function detectAllFacesWithDescriptors(canvas) {
  try {
    if (!canvas) throw new Error('Canvas element is required');

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.4
    });

    const detections = await faceapi
      .detectAllFaces(canvas, options)
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections.map(d => ({
      detection: d,
      descriptor: Array.from(d.descriptor)
    }));
  } catch (err) {
    console.error('Face detection error:', err);
    throw err;
  }
}

// ===== Face Matching =====

/**
 * Calculate Euclidean distance between two face descriptors
 * @param {Array<number>} descriptor1 - First face embedding
 * @param {Array<number>} descriptor2 - Second face embedding
 * @returns {number} Distance value (lower is better match)
 */
export function calculateDistance(descriptor1, descriptor2) {
  if (!Array.isArray(descriptor1) || !Array.isArray(descriptor2)) {
    return Infinity;
  }

  let sum = 0;
  const length = Math.min(descriptor1.length, descriptor2.length);

  for (let i = 0; i < length; i++) {
    const diff = (Number(descriptor1[i]) || 0) - (Number(descriptor2[i]) || 0);
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Find best matching student by face descriptor
 * @param {Array<number>} faceDescriptor - Detected face embedding
 * @param {Array<Object>} students - Array of { _id, name, faceEmbedding }
 * @param {number} threshold - Distance threshold (default 0.48)
 * @returns {Object|null} { student, distance } or null if no match
 */
export function findBestMatch(faceDescriptor, students, threshold = 0.48) {
  if (!Array.isArray(students) || students.length === 0) {
    return null;
  }

  let bestMatch = {
    student: null,
    distance: Infinity
  };

  students.forEach(student => {
    if (
      !student.faceEmbedding ||
      !Array.isArray(student.faceEmbedding) ||
      student.faceEmbedding.length === 0
    ) {
      return;
    }

    const distance = calculateDistance(faceDescriptor, student.faceEmbedding);

    if (distance < bestMatch.distance) {
      bestMatch = {
        student,
        distance
      };
    }
  });

  if (bestMatch.distance > threshold) {
    return null;
  }

  return bestMatch;
}

// ===== Utility Functions =====

/**
 * Convert canvas to base64 JPEG string
 * @param {HTMLCanvasElement} canvas
 * @param {number} quality - 0-1
 * @returns {string} Base64 data URL
 */
export function canvasToBase64(canvas, quality = 0.8) {
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Draw detection box on canvas
 * @param {HTMLCanvasElement} canvas
 * @param {Object} detection - Face detection result
 * @param {string} label - Text label to draw
 * @param {string} color - Box color (default 'green')
 */
export function drawDetectionBox(canvas, detection, label = '', color = '#00FF00') {
  const ctx = canvas.getContext('2d');
  if (!ctx || !detection) return;

  const { x, y, width, height } = detection.detection.box;

  // Draw rectangle
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);

  // Draw label
  if (label) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 30, width, 30);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(label, x + 5, y - 10);
  }
}

export default {
  loadFaceApiModels,
  areModelsLoaded,
  detectSingleFaceDescriptor,
  detectAllFacesWithDescriptors,
  calculateDistance,
  findBestMatch,
  canvasToBase64,
  drawDetectionBox
};
