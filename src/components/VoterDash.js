import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

function VoterDash() {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase(app);
    const electionsRef = ref(db, 'Elections');

    // Fetch upcoming elections data from Firebase Realtime Database
    onValue(electionsRef, (snapshot) => {
      const data = snapshot.val();
      delete data['safe']
      if (data) {
        const upcomingElectionsArray = Object.entries(data);
        setUpcomingElections(upcomingElectionsArray);
      } else {
        setUpcomingElections([]);
      }
    });
  }, []);

  const handleElectionClick = (electionKey) => {
    navigate(`/election-page/${electionKey}`);
  };

  return (
    <div className="VoterDash">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Voter Dashboard</h2>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Upcoming Elections</h3>
        <div className="elections-grid">
          {upcomingElections.map(([key, value]) => (
            <div key={key} className="election-card" onClick={() => handleElectionClick(key)}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{value.name}</h4>
              <p>Start Time: {new Date(value.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(value.endTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoterDash;
