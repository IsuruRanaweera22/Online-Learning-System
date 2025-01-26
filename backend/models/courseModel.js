const admin = require('../lib/firebaseAdmin'); // Import the initialized admin instance

const db = admin.firestore();

// Function to add a new course to Firestore
const addCourse = async (courseData) => {
    try {
        const courseRef = db.collection('courses').doc(); // Creates a new document with auto-generated ID
        await courseRef.set(courseData);
        return { id: courseRef.id, ...courseData }; // Return course data with ID
    } catch (error) {
        throw new Error('Error adding course: ' + error.message);
    }
};

// Function to delete a course
const deleteCourse = async (courseId) => {
  try {
    console.log('inside deleteCourse')
    await db.collection('courses').doc(courseId).delete();
    return { message: 'Course deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting course: ' + error.message);
  }
};

const updateCourse = async (courseId, courseData) => {
  const courseRef = admin.firestore().collection('courses').doc(courseId);
  const courseSnapshot = await courseRef.get();

  if (!courseSnapshot.exists) {
    throw new Error('Course not found');
  }
  // Update course with new data (can be partial data for updating only specific fields)
  await courseRef.update(courseData);

  return { courseId, ...courseData }; // Return updated course details
};


module.exports = {
  addCourse,
  deleteCourse,
  updateCourse
};