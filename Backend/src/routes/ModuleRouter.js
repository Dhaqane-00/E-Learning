const express = require('express');
const router = express.Router();
const { 
  createModule, 
  updateModule, 
  deleteModule, 
  getModuleById,
  reorderModules 
} = require('../controller/courseModule');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Module routes
router.post('/:courseId', authorize(['Instructor', 'Admin']), createModule);
router.put('/:moduleId', authorize(['Instructor', 'Admin']), updateModule);
router.delete('/:moduleId', authorize(['Instructor', 'Admin']), deleteModule);
router.get('/:moduleId', getModuleById);
router.put('/:courseId/reorder-modules', authorize(['Instructor', 'Admin']), reorderModules);

module.exports = router; 