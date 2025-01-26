const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { addCourse, deleteCourse, updateCourse } = require('../models/courseModel'); // Import the Firestore function
const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Add a new course to the platform
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               instructor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course added successfully
 *       400:
 *         description: Bad request, missing fields
 *       500:
 *         description: Error adding course
 */

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

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Deletes a course by its ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
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

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Updates a course's details by its ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the course
 *               description:
 *                 type: string
 *                 description: The new description of the course
 *               duration:
 *                 type: string
 *                 description: The new duration of the course
 *               instructor:
 *                 type: string
 *                 description: The new instructor for the course
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedCourse:
 *                   type: object
 *                   description: The updated course details
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