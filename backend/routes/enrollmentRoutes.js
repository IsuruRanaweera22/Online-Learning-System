const express = require('express');
const { enrollInCourse, getEnrolledCourses } = require('../models/enrollmentModel'); // Import the Enrollment model
const router = express.Router();

// Enroll a student in a course
router.post('/:studentId/enroll', async (req, res) => {
  const { studentId } = req.params;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  try {
    const result = await enrollInCourse(studentId, courseId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
});

// Get the list of enrolled courses for a student
router.get('/:studentId/enrolled-courses', async (req, res) => {
  const { studentId } = req.params;

  try {
    const enrolledCourses = await getEnrolledCourses(studentId);
    res.status(200).json({ enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
});

module.exports = router;
