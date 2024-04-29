// Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom';

function Logout() {
  const history = useHistory();

  const handleLogout = () => {
    // Perform logout action here (clear session, etc.)
    // For example, you can clear local storage or perform any other necessary cleanup
    // Then navigate back to the login page
    // Replace '/login' with the actual path to your login page
    localStorage.removeItem('loggedIn'); // Clear login session
    history.push('/login');
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ backgroundColor: '#1a63da', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>Logout</button>
    </div>
  );
}

export default Logout;
