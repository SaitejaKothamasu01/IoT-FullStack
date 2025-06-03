// src/components/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '../firebase'; // Import the function
import { auth, setUserRole } from '../firebase';  // Import Firebase auth and setUserRole function

const Register = ({ setAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('viewer');  // Default to 'viewer'

  // Handle role change (admin, technician, viewer)
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create user using Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set the user role in Firestore
      await setUserRole(userCredential.user.uid, role);  // Set role to Firestore

      setAuthenticated(true); // If registration is successful, set authenticated to true
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        
        {/* Select role for user */}
        <select value={role} onChange={handleRoleChange}>
          <option value="administrator">Administrator</option>
          <option value="technician">Technician</option>
          <option value="viewer">Viewer</option>
        </select>

        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
