const express = require('express');
const { enrollInCourse, getEnrolledCourses } = require('../models/enrollmentModel'); // Import the Enrollment model
const router = express.Router();

/**
 * @swagger
 * /api/students/{studentId}/enroll:
 *   post:
 *     summary: Enroll a student in a course
 *     description: Enrolls a student in a specified course
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: The ID of the student
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course to enroll the student in
 *                 example: "12345"
 *     responses:
 *       201:
 *         description: Student enrolled in the course successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 courseId:
 *                   type: string
 *       400:
 *         description: Bad request - Course ID is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
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

/**
 * @swagger
 * /api/students/{studentId}/enrolled-courses:
 *   get:
 *     summary: Get the list of enrolled courses for a student
 *     description: Fetches the list of courses a student is enrolled in
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: The ID of the student
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       instructor:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
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
