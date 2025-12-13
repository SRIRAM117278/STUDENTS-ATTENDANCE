/**
 * Simple DB connection test script.
 * Usage:
 *   node testConnection.js
 * Exits with code 0 on success, 1 on failure.
 */
require('dotenv').config();
const connectDB = require('./config/db');

async function test(){
  try{
    console.log('Testing MongoDB connection...');
    const conn = await connectDB();
    console.log('Connection test successful. Host:', conn.connection.host);
    // close connection
    await conn.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Connection test failed:', err.message || err);
    process.exit(1);
  }
}

test();
