import React, { useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [voterId, setVoterId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isValidVoter, setIsValidVoter] = useState(false);
  const [isValidAdmin, setIsValidAdmin] = useState(false);
  const navigate = useNavigate();

  const handleCheckVoterId = () => {
    const db = getDatabase(app);
    const votersRef = ref(db, 'voters');

    onValue(votersRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.hasOwnProperty(voterId) ) {
        setIsValidVoter(true);
        navigate(`/voter-dashboard/${voterId}`);
      } else {
        setIsValidVoter(false);
      }
    });
  };

  const handleCheckAdminEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailRegex.test(adminEmail)) {
      console.error('Invalid email format');
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      .then(() => {
        setIsValidAdmin(true);
        console.log("Admin email is valid. You can proceed.");
        navigate('/admin-dashboard');
      })
      .catch((error) => {
        setIsValidAdmin(false);
        console.error(error.message);
      });
  };

  return (
    <div className="App">
      <h1>Voter and Admin Authentication</h1>
      <div className="login-container">
        <div className="voter-login">
          <h2>Voter Login</h2>
          <input
            type="text"
            placeholder="Enter Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
          />
          <button onClick={handleCheckVoterId}>Login</button>
          {isValidVoter ? (
            <p>Voter ID is valid. You can proceed.</p>
          ) : (
            <p>Voter ID is not valid. Please check and try again.</p>
          )}
        </div>
        <div className="vertical-line"></div>
        <div className="admin-login">
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button onClick={handleCheckAdminEmail}>Login</button>
          {isValidAdmin ? (
            <p>Admin email is valid. You can proceed.</p>
          ) : (
            <p>Admin email is not valid. Please check and try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogIn;
