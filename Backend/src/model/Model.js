const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: 'Dhaqane123' },
  role: { type: String, enum: ['Admin', 'Instructor', 'Student'], default: 'Student' },
  profileImage: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }],
},
 { timestamps: true }
);

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  category: { type: String, default: "General" },
  thumbnailImage: { type: String, default: 'https://cdn.pixabay.com/photo/2022/01/28/12/17/distance-learning-6974511_1280.jpg' },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: [] }],
  tags: [String]
}, { timestamps: true });

// Module Schema
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },//part1
  description: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: [] }]
}, { timestamps: true });

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: String,
  duration: Number,
  content: String,
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },
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
  progress: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  },
  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],
  lastAccessedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  moduleProgress: [{
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progress: { type: Number, default: 0 }
  }],
  paymentStatus: { type: String, enum: ['Pending', 'Paid' ,], default: 'Pending' },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Module = mongoose.model('Module', moduleSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = { User, Course, Module, Lesson, Quiz, Enrollment };
