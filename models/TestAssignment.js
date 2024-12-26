const mongoose = require('mongoose');

const testAssignmentSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  score: Number
});

module.exports = mongoose.model('TestAssignment', testAssignmentSchema);