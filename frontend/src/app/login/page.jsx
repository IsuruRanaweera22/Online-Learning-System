"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Adjust the path if necessary
import { useRouter } from 'next/navigation';
import { getIdToken } from "firebase/auth"; // Import Firebase function to get JWT token

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate the user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, userName, password);
      const user = userCredential.user;

      // Get the Firebase ID Token (JWT token)
      const idToken = await getIdToken(user);

      // Store the token in localStorage or a global state for further API requests
      localStorage.setItem("authToken", idToken); // Example of storing token in localStorage

      router.push('/'); // Redirect to homepage after login
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="text-center mb-4 text-bold" style={{fontSize:'30px'}}>Online Learning Platform</h2>
        </div>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">Log in</button>
          <div className="text-center mt-2">
            <a href="#" className="text-muted">Forgot password?</a>
          </div>
          <div className="text-center mt-2">
            Don't have an account? <button 
              type="button" 
              className="btn btn-link" 
              onClick={(e) => {
                e.preventDefault(); // Prevent default form submission
                router.push('/register');
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
