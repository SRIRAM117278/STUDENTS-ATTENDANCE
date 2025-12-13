/**
 * Database seed script - populates sample students with face embeddings
 * Run: npm run dev && node seed.js (ensure MongoDB is running)
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

// Helper function to generate mock face embeddings (128-dimensional)
const generateMockEmbedding = (seed) => {
  const arr = [];
  for (let i = 0; i < 128; i++) {
    arr.push(Math.sin(seed + i) * 0.5 + Math.cos(seed * i) * 0.3);
  }
  return arr;
};

// Sample students with Indian names
const sampleStudents = [
  {
    name: 'Aarav Sharma',
    rollNumber: '001',
    className: '10A',
    faceEmbedding: generateMockEmbedding(1001),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Priya Reddy',
    rollNumber: '002',
    className: '10A',
    faceEmbedding: generateMockEmbedding(1002),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Kunal Mehta',
    rollNumber: '003',
    className: '10A',
    faceEmbedding: generateMockEmbedding(1003),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Divya Nair',
    rollNumber: '004',
    className: '10B',
    faceEmbedding: generateMockEmbedding(1004),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Rohan Kumar',
    rollNumber: '005',
    className: '10B',
    faceEmbedding: generateMockEmbedding(1005),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Sneha Patil',
    rollNumber: '006',
    className: '10B',
    faceEmbedding: generateMockEmbedding(1006),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Abhinav Singh',
    rollNumber: '007',
    className: '10C',
    faceEmbedding: generateMockEmbedding(1007),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Meera Joshi',
    rollNumber: '008',
    className: '10C',
    faceEmbedding: generateMockEmbedding(1008),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Varun Gupta',
    rollNumber: '009',
    className: '10C',
    faceEmbedding: generateMockEmbedding(1009),
    isEnrolled: true,
    enrolledAt: new Date()
  },
  {
    name: 'Harini Iyer',
    rollNumber: '010',
    className: '10A',
    faceEmbedding: generateMockEmbedding(1010),
    isEnrolled: true,
    enrolledAt: new Date()
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Clear existing students
    await Student.deleteMany({});
    console.log('✓ Cleared existing students');

    // Insert sample students
    const created = await Student.insertMany(sampleStudents);
    console.log(`✓ Created ${created.length} sample students\n`);

    // Display created students
    created.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.name.padEnd(20)} | Roll: ${s.rollNumber} | Class: ${s.className}`);
    });

    console.log('\n✓ Database seeding completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
    if(existing) continue;
    await Student.create({ name, rollNumber: roll, className, age: 16 + (i%5) });
    console.log('Inserted', name);
  }
  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1) });
