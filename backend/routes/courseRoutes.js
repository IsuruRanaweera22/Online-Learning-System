const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { addCourse, deleteCourse, updateCourse } = require('../models/courseModel'); // Import the Firestore function
const router = express.Router();

// Add a new course (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, description, duration, instructor } = req.body;

    // Ensure all fields are provided
    if (!title || !description || !duration || !instructor) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const courseData = { title, description, duration, instructor };
    const newCourse = await addCourse(courseData); // Use Firestore model function
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
});

// Delete a course (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    console.log('inside adminMiddleware', req.params.id)
    const courseId = req.params.id;
    console.log('courseId', courseId)
    const response = await deleteCourse(courseId);
    res.status(200).json({ message: 'Course deleted successfully', response });
  } catch (error) {
    console.log('inside catch')
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = req.body; // The new data for the course (from the client)

    const updatedCourse = await updateCourse(courseId, courseData);

    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

  

module.exports = router;