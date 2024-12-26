const Test = require('../models/Test');
const TestAssignment = require('../models/TestAssignment');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

exports.createTest = async (req, res) => {
  try {
    const { title, description, type, questions } = req.body;
    
    const test = new Test({
      title,
      description,
      type,
      questions,
      createdBy: req.user._id
    });

    await test.save();
    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: "Error creating test", error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};

    const tests = await Test.find(query)
      .populate('createdBy', 'email')
      .sort('-createdAt');

    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: "Error fetching tests", error: error.message });
  }
};

exports.assignTest = async (req, res) => {
  try {
    const { testId, userId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid test ID or user ID format" });
    }

    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const assignment = new TestAssignment({
      test: testId,
      user: userId
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning test:', error);
    res.status(500).json({ message: "Error assigning test", error: error.message });
  }
};

exports.updateTestScore = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { score } = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }

    const assignment = await TestAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.score = score;
    assignment.completedAt = new Date();
    await assignment.save();

    res.json(assignment);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ message: "Error updating score", error: error.message });
  }
};

exports.getAverageMarks = async (req, res) => {
  try {
    const { testId } = req.params;

    // Validate testId format
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID format" });
    }

    // Convert string ID to ObjectId
    const testObjectId = new mongoose.Types.ObjectId(testId);

    const result = await TestAssignment.aggregate([
      {
        $match: { 
          test: testObjectId,
          score: { $exists: true, $ne: null }  
        }
      },
      {
        $group: {
          _id: "$test",
          averageScore: { $avg: "$score" },
          totalAssignments: { $sum: 1 }
        }
      }
    ]);

    // Check if any assignments were found
    if (result.length === 0) {
      return res.json({ 
        testId,
        averageScore: 0,
        totalAssignments: 0,
        message: "No completed assignments found for this test"
      });
    }

    res.json({ 
      testId,
      averageScore: result[0].averageScore,
      totalAssignments: result[0].totalAssignments
    });
  } catch (error) {
    console.error('Error calculating average marks:', error);
    res.status(500).json({ message: "Error calculating average marks", error: error.message });
  }
};
