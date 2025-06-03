// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from '../firebase'; // Import Firebase sign-in function
import { auth, getUserRole } from '../firebase';  // Import Firebase auth and role fetching function

const Login = ({ setAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Handle the login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign the user in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the user's role from Firestore
      const role = await getUserRole(user.uid);

      // Save the user's role to localStorage or state for future access control
      localStorage.setItem('role', role);

      // Set authenticated to true
      setAuthenticated(true);
    } catch (error) {
      setError(error.message);  // Display error message
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
