const Test = require('../models/Test');
const TestAssignment = require('../models/TestAssignment');
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
    res.status(500).json({ message: "Error fetching tests", error: error.message });
  }
};

exports.assignTest = async (req, res) => {
  try {
    const { testId, userId } = req.body;

    const assignment = new TestAssignment({
      test: testId,
      user: userId
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error assigning test", error: error.message });
  }
};

exports.updateTestScore = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { score } = req.body;

    const assignment = await TestAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.score = score;
    assignment.completedAt = new Date();
    await assignment.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error updating score", error: error.message });
  }
};

exports.getAverageMarks = async (req, res) => {
  try {
    const { testId } = req.params;

    const result = await TestAssignment.aggregate([
      {
        $match: { 
          test: testId,
          score: { $exists: true }  // Only include assignments with scores
        }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" }
        }
      }
    ]);

    res.json({ 
      testId,
      averageScore: result[0]?.averageScore || 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating average marks", error: error.message });
  }
};