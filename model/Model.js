const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  googleId: String || null,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Instructor', 'Student'], default: 'Student' },
  profileImage: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  category: String,
  thumbnailImage: String,
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  tags: [String]
}, { timestamps: true });

// Module Schema
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
}, { timestamps: true });

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: String,
  duration: Number,
  content: String,
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  type: { type: String, enum: ['Video', 'Text', 'Quiz'], default: 'Video' }
}, { timestamps: true });

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ text: String, isCorrect: Boolean }],
  }]
}, { timestamps: true });

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  quizScores: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    score: Number
  }]
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Module = mongoose.model('Module', moduleSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = { User, Course, Module, Lesson, Quiz, Enrollment };
