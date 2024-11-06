const express = require('express');
const router = express.Router();
const { 
  createLesson, 
  updateLesson, 
  deleteLesson, 
  getLessonById,
  reorderLessons,
  addQuizToLesson 
} = require('../controller/Lesson');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(authenticate);

// Lesson routes
router.post(
  '/module/:moduleId/lesson',
  authorize(['Instructor', 'Admin']),
  upload.single('video'),
  createLesson
);

router.put(
  '/lesson/:lessonId',
  authorize(['Instructor', 'Admin']),
  upload.single('video'),
  updateLesson
);

router.delete(
  '/module/:moduleId/lesson/:lessonId',
  authorize(['Instructor', 'Admin']),
  deleteLesson
);

router.get(
  '/lesson/:lessonId',
  getLessonById
);

router.put(
  '/module/:moduleId/reorder-lessons',
  authorize(['Instructor', 'Admin']),
  reorderLessons
);

router.post(
  '/lesson/:lessonId/quiz',
  authorize(['Instructor', 'Admin']),
  addQuizToLesson
);

module.exports = router; 