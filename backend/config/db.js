// MongoDB connection using mongoose
const mongoose = require('mongoose');

/**
 * Connect to MongoDB using MONGO_URI env or fallback to local.
 * Exports an async function that resolves once connected.
 */
const DEFAULT_LOCAL = 'mongodb://127.0.0.1:27017/student-attendance';

const connectDB = async (uri) => {
  const MONGO_URI = uri || process.env.MONGO_URI || DEFAULT_LOCAL;
  try {
    console.log('Connecting to MongoDB...');
    // Recommended mongoose options are handled by current mongoose versions
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);
    throw error;
  }
};

module.exports = connectDB;
