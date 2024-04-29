import React, { useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Import your custom CSS file

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [voterId, setVoterId] = useState('');
  const [isValidVoter, setIsValidVoter] = useState(false);
  const [isValidAdmin, setIsValidAdmin] = useState(false);
  const [voterCheckAttempted, setVoterCheckAttempted] = useState(false);
  const [adminCheckAttempted, setAdminCheckAttempted] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState(false);
  const [voterLoginError, setVoterLoginError] = useState(false);
  const navigate = useNavigate();

  const handleCheckVoterId = () => {
    setVoterCheckAttempted(true);
    const db = getDatabase(app);
    const votersRef = ref(db, 'voters');

    onValue(votersRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.hasOwnProperty(voterId)) {
        setIsValidVoter(true);
        setVoterLoginError(false); // Clear login error message
        navigate(`/voter-dashboard/${voterId}`);
      } else {
        setIsValidVoter(false);
        setVoterLoginError(true);
      }
    }, {
      onlyOnce: true
    });
  };

  const handleCheckAdminEmail = async () => {
    setAdminCheckAttempted(true);
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsValidAdmin(true);
      setAdminLoginError(false); // Clear login error message
      navigate('/admin-dashboard');
    } catch (error) {
      setIsValidAdmin(false);
      setAdminLoginError(true);
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="Apps">
        <h1>Voter and Admin Authentication</h1>
        <div className="login-container">
          <div className="voter-login">
            <h2>Voter Login</h2>
            <div className="myvoterid">
            <label htmlFor="voterId">Voter ID:</label></div>
            <input
              type="text"
              id="voterId"
              placeholder="Enter Voter ID"
              className={voterLoginError ? "invalid-input" : ""}
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />
            <button onClick={handleCheckVoterId} className="login-button">
              Login
            </button>
            {voterCheckAttempted && voterLoginError && (
              <p className="error-message">Voter ID is not valid. Please check and try again.</p>
            )}
          </div>
          <div className="vertical-line"></div>
          <div className="admin-login">
            <h2>Admin Login</h2>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Admin Email"
                className={adminLoginError ? "invalid-input" : ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                className={adminLoginError ? "invalid-input" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleCheckAdminEmail} className="small-login-button">
              Login
            </button>
            {adminCheckAttempted && adminLoginError && (
              <p className="error-message">Invalid email or password. Please check and try again.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
