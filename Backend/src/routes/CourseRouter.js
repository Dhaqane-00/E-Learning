const express = require('express');
const router = express.Router();
const {createCourse, updateCourse, deleteCourse, getAllCourses, getCourseById, getInstructorCourses, searchCourses, getUserCourses} = require('../controller/Course');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/search', searchCourses);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.post('/create', authenticate, upload.single('thumbnailImage'), createCourse);
router.put('/update/:id', authenticate, upload.single('thumbnailImage'), updateCourse);
router.delete('/delete/:id', authenticate, deleteCourse);
router.get('/instructor/courses', authenticate, getInstructorCourses);

// Get user's paid and All courses
router.get('/user-courses', authenticate, getUserCourses);

module.exports = router; 