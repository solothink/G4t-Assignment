const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createTest, 
  getTests, 
  assignTest,
  getAverageMarks,
  updateTestScore
} = require('../controllers/testController');

const router = express.Router();

// Validation middleware
const testValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['public', 'private']).withMessage('Invalid test type')
];

// Create test
router.post('/', 
  authMiddleware,
  roleCheck(['admin', 'super-admin']),
  testValidation,
  validateRequest,
  createTest
);

// Get tests
router.get('/', authMiddleware, getTests);

// Assign test
router.post('/assign',
  authMiddleware,
  roleCheck(['admin', 'super-admin']),
  [
    body('testId').notEmpty().withMessage('Test ID is required'),
    body('userId').notEmpty().withMessage('User ID is required')
  ],
  validateRequest,
  assignTest
);

// Update test score
router.patch('/assignment/:assignmentId/score',
  authMiddleware,
  roleCheck(['admin', 'super-admin']),
  [
    body('score').isNumeric().withMessage('Score must be a number')
  ],
  validateRequest,
  updateTestScore
);

// Get average marks
router.get('/:testId/average-marks', authMiddleware, getAverageMarks);

module.exports = router;
