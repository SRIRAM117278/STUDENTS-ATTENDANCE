// Entry point for backend server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images under /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.get('/', (req, res) => res.send('Students Attendance API'));

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server after DB connection is established
connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
	console.error('Failed to connect to MongoDB. Server not started.');
	process.exit(1);
});

module.exports = app;
