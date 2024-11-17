const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/Enrollment');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create new enrollment
router.post('/:courseId', enrollmentController.createEnrollment);

// Get all enrollments for current user
router.get('/', enrollmentController.getUserEnrollments);

// Get specific enrollment details
router.get('/:enrollmentId', enrollmentController.getEnrollmentDetails);

// Get enrollment progress
router.get('/:enrollmentId/progress', enrollmentController.getEnrollmentProgress);

// Update enrollment progress
router.put('/:enrollmentId/progress', enrollmentController.updateProgress);

// Submit quiz score
router.post('/:enrollmentId/quiz', enrollmentController.submitQuizScore);

module.exports = router; 