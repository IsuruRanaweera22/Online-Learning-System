"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; // Import Firestore
import { useRouter } from 'next/navigation';
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { getIdToken } from "firebase/auth"; // Import Firebase function to get JWT token

const RegisterPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userName, password);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        gender,
        dob,
        userName
      });

      // Get the Firebase ID Token (JWT token) after registration
      const idToken = await getIdToken(user);

      // Store the token in localStorage or a global state for further API requests
      localStorage.setItem("authToken", idToken); // Example of storing token in localStorage

      setUserName('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setGender('');
      setDob('');
      router.push('/'); // Redirect to homepage after successful registration
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="firstName" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="lastName" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select 
              className="form-control" 
              id="gender" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input 
              type="date" 
              className="form-control" 
              id="dob" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Username</label>
            <input 
              type="email" 
              className="form-control" 
              id="userName" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
          <div className="text-center mt-2">
            Already have an account? <button className="btn btn-link" onClick={() => router.push('/login')}>Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
