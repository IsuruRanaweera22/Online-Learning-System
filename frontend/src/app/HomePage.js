"use client";

import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig"; 
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore"; // Added deleteDoc for deleting
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [view, setView] = useState('allCourses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null); // State for the student being edited
  const [newStudentData, setNewStudentData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    gender: '',
    dob: ''
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList);

        // Fetching students if the user is an admin
        const studentsSnapshot = await getDocs(collection(db, "users"));
        const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsList);
        
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const handleEnroll = (courseId) => {
    alert(`Enrolled in course with ID: ${courseId}`);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      if (newCourse.title && newCourse.description && newCourse.duration && newCourse.instructor) {
        const token = user?.stsTokenManager?.accessToken;
        if (token) {
          const response = await fetch('http://localhost:3001/api/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newCourse),
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Course added successfully:', data);
          } else {
            const errorData = await response.json();
            console.log('Error adding course:', errorData.message);
          }
        } else {
          console.error('No Firebase token found');
        }
      } else {
        alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error adding course:', error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = user?.stsTokenManager?.accessToken;
      if (token) {
        const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setCourses(courses.filter(course => course.id !== courseId));
        } else {
          const errorData = await response.json();
          console.log('Error deleting course:', errorData.message);
        }
      } else {
        console.error('No Firebase token found');
      }
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };

  const handleEditCourse = async (courseId) => {
    const courseToEdit = courses.find(course => course.id === courseId);
    setEditingCourse(courseToEdit); // Set course data for editing
    setNewCourse(courseToEdit); // Pre-fill form fields
    setShowCourseForm(true); // Show form to edit course
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      if (newCourse.title && newCourse.description && newCourse.duration && newCourse.instructor) {
        const token = user?.stsTokenManager?.accessToken;
        if (token) {
          const response = await fetch(`http://localhost:3001/api/courses/${editingCourse.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newCourse),
          });
          if (response.ok) {
            const updatedCourse = await response.json();
            console.log('Course updated successfully:', updatedCourse);
            setCourses(courses.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
            setShowCourseForm(false); // Close the form after updating
            setEditingCourse(null); // Reset editing state
          } else {
            const errorData = await response.json();
            console.log('Error updating course:', errorData.message);
          }
        } else {
          console.error('No Firebase token found');
        }
      } else {
        alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error updating course:', error.message);
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (studentId) => {
    try {
      const token = user?.stsTokenManager?.accessToken;
      if (token) {
        const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setStudents(students.filter(student => student.id !== studentId)); // Remove student from UI
        } else {
          const errorData = await response.json();
          console.log('Error deleting student:', errorData.message);
        }
      } else {
        console.error('No Firebase token found');
      }
    } catch (error) {
      console.error('Error deleting student:', error.message);
    }
  };

  // Handle student edit
  const handleEditStudent = (studentId) => {
    const studentToEdit = students.find(student => student.id === studentId);
    setEditingStudent(studentToEdit); // Set student data for editing
    setNewStudentData({
      firstName: studentToEdit.firstName,
      lastName: studentToEdit.lastName,
      userName: studentToEdit.userName,
      gender: studentToEdit.gender,
      dob: studentToEdit.dob
    });
  };

  // Handle student update
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      if (newStudentData.firstName && newStudentData.lastName && newStudentData.userName && newStudentData.gender && newStudentData.dob) {
        const token = user?.stsTokenManager?.accessToken;
        if (token) {
          
          const response = await fetch(`http://localhost:3001/api/students/${editingStudent.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newStudentData),
          });
          if (response.ok) {
            const updatedStudent = await response.json();
            console.log('Student updated successfully:', updatedStudent);
            setStudents(students.map(student => (student.id === updatedStudent.id ? updatedStudent : student)));
            setEditingStudent(null); // Clear editing state
            setNewStudentData({ firstName: '', lastName: '', userName: '', gender: '', dob: '' }); // Reset form data
          } else {
            const errorData = await response.json();
            console.log('Error updating student:', errorData.message);
          }
        } else {
          console.error('No Firebase token found');
        }
      } else {
        alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error updating student:', error.message);
    }
  };

  return (
    <div>
      <header className="d-flex justify-content-between align-items-center bg-primary p-3 text-white">
        <div>
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <div>
          {user ? (
            <div>
              You are logged in as {userData ? `${userData.firstName} ${userData.lastName}` : user.email}. (<button className="btn btn-link p-0 text-white" onClick={handleLogout}>Log out</button>)
            </div>
          ) : (
            <div>
              You are not logged in. (<button className="btn btn-link p-0 text-white" onClick={() => router.push('/login')}>Log in</button>)
            </div>
          )}
        </div>
      </header>

      <div className="container mt-4">
        <div className="row">
          <nav className="col-md-3">
            <ul className="list-group">
              <li className={`list-group-item ${view === 'allCourses' ? 'active' : ''}`} onClick={() => setView('allCourses')}>All Courses</li>
              <li className={`list-group-item ${view === 'myCourses' ? 'active' : ''}`} onClick={() => setView('myCourses')}>My Courses</li>
              {user?.email.startsWith('admin.') && (
                <li className={`list-group-item ${view === 'students' ? 'active' : ''}`} onClick={() => setView('students')}>All Students</li>
              )}
            </ul>
          </nav>

          <main className="col-md-9">
            {!user ? (
              <div className="text-center">
                <h1>Welcome to the Learning Management System of the Faculty of Science, University of Colombo.</h1>
                <p className="text-muted">Please register or log in to explore courses and other features.</p>
              </div>
            ) : (
              <div>
                <h1>Welcome back!</h1>
                <p>Explore your courses and interact in forums.</p>

                {user.email.startsWith('admin.') && (
                  <button className="btn btn-primary" onClick={() => setShowCourseForm(!showCourseForm)}>
                    {showCourseForm ? 'Cancel' : 'Add New Course'}
                  </button>
                )}

                {showCourseForm && (
                  <div className="mt-4">
                    <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                    <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="description"
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="duration" className="form-label">Duration (in hours)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="duration"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="instructor" className="form-label">Instructor</label>
                        <input
                          type="text"
                          className="form-control"
                          id="instructor"
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        {editingCourse ? 'Update Course' : 'Add Course'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="mt-4">
                  {view === 'allCourses' && (
                    <>
                      <h2>All Courses</h2>
                      <ul className="list-group">
                        {courses.map(course => (
                          <li key={course.id} className="list-group-item">
                            {course.title}
                            {user.email.startsWith('admin.') && (
                              <span>
                                <button className="btn btn-danger btn-sm float-end ml-2" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                <button className="btn btn-info btn-sm float-end" onClick={() => handleEditCourse(course.id)}>Edit</button>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {view === 'students' && (
                    <div>
                      <h2>All Students</h2>
                      <ul className="list-group">
                        {user.email.startsWith('admin.') && students.map(student => (
                          <li key={student.id} className="list-group-item">
                          <div>
                            <strong>{student.firstName} {student.lastName}</strong> <br />
                            <span>{student.userName}</span> <br />
                            <span>{student.gender}</span> <br />
                            <span>Date of Birth: {student.dob}</span>
                          </div>
                          <button className="btn btn-danger btn-sm float-end" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                          <button className="btn btn-info btn-sm float-end mr-2" onClick={() => handleEditStudent(student.id)}>Edit</button>
                        </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
          {editingStudent && (
            <div className="col-12 mt-4">
              <h3>Edit Student</h3>
              <form onSubmit={handleUpdateStudent}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={newStudentData.firstName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={newStudentData.lastName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    value={newStudentData.userName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, userName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <input
                    type="text"
                    className="form-control"
                    id="gender"
                    value={newStudentData.gender}
                    onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    value={newStudentData.dob}
                    onChange={(e) => setNewStudentData({ ...newStudentData, dob: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update Student</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;