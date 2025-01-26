const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { addStudent, deleteStudent, updateStudent, getStudentById, getAllStudents } = require('../models/studentModel');
const router = express.Router();

/**
 * @swagger
 * /api/students/:
 *   post:
 *     summary: Add a new student
 *     description: Adds a new student to the system (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "123-456-7890"
 *               courseId:
 *                 type: string
 *                 description: The ID of the course the student is enrolled in
 *                 example: "course123"
 *     responses:
 *       201:
 *         description: Student added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student added successfully"
 *                 student:
 *                   type: object
 *                   description: Details of the newly added student
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Deletes a student from the system by ID (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student deleted successfully"
 *                 response:
 *                   type: object
 *                   description: Details of the delete operation
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const response = await deleteStudent(studentId);
    res.status(200).json({ message: 'Student deleted successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update student details
 *     description: Updates the details of an existing student (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "123-456-7890"
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student updated successfully"
 *                 updatedStudent:
 *                   type: object
 *                   description: Updated student details
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Fetches the details of a student by their ID (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   type: object
 *                   description: Student details
 *       500:
 *         description: Internal server error
 */

router.get('/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await getStudentById(studentId);
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
});

/**
 * @swagger
 * /api/students/:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a list of all students (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       courseId:
 *                         type: string
 *       500:
 *         description: Internal server error
 */

router.get('/', adminMiddleware, async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
});

module.exports = router;
