const admin = require('../lib/firebaseAdmin'); // Import the initialized admin instance
const db = admin.firestore();

// Function to add a course enrollment
const enrollInCourse = async (studentId, courseId) => {
  try {
    const enrollmentRef = db.collection('enrollments').doc(studentId); // Document for the student
    const studentEnrollments = await enrollmentRef.get();
    
    if (!studentEnrollments.exists) {
      // If the student has no enrollments, initialize with the first course
      await enrollmentRef.set({
        courses: [courseId], // Store course ID array
      });
    } else {
      // If the student already has enrollments, add the new course
      const courses = studentEnrollments.data().courses || [];
      if (!courses.includes(courseId)) {
        courses.push(courseId); // Avoid duplicate enrollments
        await enrollmentRef.update({ courses });
      }
    }

    return { message: 'Course enrolled successfully' };
  } catch (error) {
    throw new Error('Error enrolling in course: ' + error.message);
  }
};

// Function to fetch enrolled courses for a student
const getEnrolledCourses = async (studentId) => {
  try {
    console.log('studentId getEnrolledCourses', studentId)
    const enrollmentRef = db.collection('enrollments').doc(studentId);
    const studentEnrollments = await enrollmentRef.get();

    if (studentEnrollments.exists) {
      return studentEnrollments.data().courses;
    } else {
      return []; // No courses enrolled
    }
  } catch (error) {
    throw new Error('Error fetching enrolled courses: ' + error.message);
  }
};

module.exports = {
  enrollInCourse,
  getEnrolledCourses
};
