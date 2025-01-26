const admin = require('../lib/firebaseAdmin'); // Import the initialized admin instance
const db = admin.firestore();

// Function to add a new student to Firestore
const addStudent = async (studentData) => {
  try {
    const studentRef = db.collection('students').doc(); // Creates a new document with auto-generated ID
    await studentRef.set(studentData);
    return { id: studentRef.id, ...studentData }; // Return student data with ID
  } catch (error) {
    throw new Error('Error adding student: ' + error.message);
  }
};

// Function to delete a student
const deleteStudent = async (studentId) => {
  try {
    await db.collection('users').doc(studentId).delete();
    return { message: 'Student deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting student: ' + error.message);
  }
};

// Function to update student details
const updateStudent = async (studentId, studentData) => {
  const studentRef = db.collection('users').doc(studentId);
  const studentSnapshot = await studentRef.get();

  if (!studentSnapshot.exists) {
    throw new Error('Student not found');
  }

  // Update student with new data (can be partial data for updating only specific fields)
  await studentRef.update(studentData);
  
  return { studentId, ...studentData }; // Return updated student details
};

// Function to get a student by ID
const getStudentById = async (studentId) => {
  const studentRef = db.collection('students').doc(studentId);
  const studentSnapshot = await studentRef.get();

  if (!studentSnapshot.exists) {
    throw new Error('Student not found');
  }

  return studentSnapshot.data();
};

// Function to get all students
const getAllStudents = async () => {
  const snapshot = await db.collection('students').get();
  const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return students;
};

module.exports = {
  addStudent,
  deleteStudent,
  updateStudent,
  getStudentById,
  getAllStudents,
};
