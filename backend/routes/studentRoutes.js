const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { addStudent, deleteStudent, updateStudent, getStudentById, getAllStudents } = require('../models/studentModel');
const router = express.Router();

// Add a new student (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, email, phone, courseId } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !phone || !courseId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const studentData = { name, email, phone, courseId };
    const newStudent = await addStudent(studentData);
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
});

// Delete a student (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const response = await deleteStudent(studentId);
    res.status(200).json({ message: 'Student deleted successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// Update student details (Admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const studentData = req.body; // New data for the student

    console.log('studentId',studentId)
    console.log('studentData',studentData)
    const updatedStudent = await updateStudent(studentId, studentData);
    res.status(200).json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// Get a student by ID (Admin only)
router.get('/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await getStudentById(studentId);
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
});

// Get all students (Admin only)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
});

module.exports = router;
