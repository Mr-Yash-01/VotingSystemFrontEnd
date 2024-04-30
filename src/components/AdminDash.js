import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

// Import Font Awesome CSS file
// import '@fortawesome/fontawesome-free/css/all.min.css';

function AdminDash() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = () => {
      const db = getDatabase(app);
      const electionsRef = ref(db, 'Elections');

      onValue(electionsRef, (snapshot) => {
        const data = snapshot.val();
        delete data['safe'];
        if (data) {
          const electionsArray = Object.entries(data);
          setElections(electionsArray);
        } else {
          setElections([]);
        }
      });
    };

    fetchElections();

    const interval = setInterval(fetchElections, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="AdminDash">
      <h2 style={{ fontSize: '38px', fontWeight: 'bold', textAlign: 'center' }}>Admin Dashboard</h2>
      <Link to="/add-new-election">
        <button style={{ marginBottom: '20px' }}>Add New Election</button>
      </Link>

      {/* Horizontal line */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginLeft: '27px' }}>Running Elections :</h3>
        <div className="elections-grid">
          {elections.filter(([index, election]) => new Date(election.startTime) < new Date() && new Date(election.endTime) > new Date()).length === 0 && <p className="no-election-message">No running elections</p>}
          {elections.map(([index, election]) => (
            new Date(election.startTime) < new Date() && new Date(election.endTime) > new Date() && (
              <div key={index} className="election-card running-elections" style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{election.name}</h4>
                <p>Start Time: {election.startTime}</p>
                <p>End Time: {election.endTime}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Horizontal line */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold',  marginLeft: '27px' }}>Upcoming Elections :</h3>
        <div className="elections-grid">
          {elections.filter(([index, election]) => new Date(election.startTime) > new Date()).length === 0 && <p className="no-election-message">No upcoming elections</p>}
          {elections.map(([index, election]) => (
            new Date(election.startTime) > new Date() && (
              <div key={index} className="election-card upcoming-elections" style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{election.name}</h4>
                <p>Start Time: {election.startTime}</p>
                <p>End Time: {election.endTime}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Horizontal line */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginLeft: '27px' }}>Ended Elections :</h3>
        <div className="elections-grid">
          {elections.filter(([index, election]) => new Date(election.endTime) < new Date()).length === 0 && <p className="no-election-message">No ended elections</p>}
          {elections.map(([index, election]) => (
            new Date(election.endTime) < new Date() && (
              <div key={index} className="election-card ended-elections" style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{election.name}</h4>
                <p>Start Time: {election.startTime}</p>
                <p>End Time: {election.endTime}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
