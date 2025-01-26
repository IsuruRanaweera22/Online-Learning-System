"use client";

import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig"; 
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore"; // Added updateDoc for updating
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('allCourses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const [editingCourse, setEditingCourse] = useState(null); // State to hold course being edited
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
                      <button type="submit" className="btn btn-success">
                        {editingCourse ? 'Update Course' : 'Add Course'}
                      </button>
                    </form>
                  </div>
                )}
                <div className="mt-4">
                  <h2>{view === 'allCourses' ? 'All Courses' : 'My Courses'}</h2>
                  <div className="list-group">
                    {courses.map(course => (
                      <div key={course.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                          <h5>{course.title}</h5>
                          <p className="mb-1">{course.description}</p>
                          <small>Instructor: {course.instructor}</small>
                        </div>
                        <div>
                          {view === 'allCourses' && user && !user.email.startsWith('admin.') && (
                            <button className="btn btn-outline-success btn-sm" onClick={() => handleEnroll(course.id)}>
                              Enroll
                            </button>
                          )}
                          {user.email.startsWith('admin.') && (
                            <div>
                              <button className="btn btn-warning" onClick={() => handleEditCourse(course.id)}>
                                Edit
                              </button>
                              <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

