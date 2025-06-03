// src/components/Logout.js
import React from 'react';
import { auth } from '../firebase';  // Correctly import auth service

const Logout = ({ setAuthenticated }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();  // Use auth.signOut() instead of firebase.auth().signOut()
      setAuthenticated(false); // Set authenticated to false when logged out
      localStorage.removeItem('authToken'); // Optionally clear authToken from localStorage
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
