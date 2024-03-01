import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

function AdminDash() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const electionsRef = ref(db, 'Elections');
    
    // Fetch elections data from Firebase Realtime Database
    onValue(electionsRef, (snapshot) => {
      const data = snapshot.val();
      delete data['safe']
      if (data) {
        const electionsArray = Object.values(data);
        setElections(electionsArray);
      } else {
        setElections([]);
      }
    });
  }, []);

  return (
    <div className="AdminDash">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Dashboard</h2>
      <Link to="/add-new-voter"><button>Add New Voter</button></Link>
      <Link to="/add-new-election"><button>Add New Election</button></Link>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Running Elections</h3>
        <div className="elections-grid">
          {elections.map((election, index) => (
            <div key={index} className="election-card">
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{election.name}</h4>
              <p>Start Time: {election.startTime}</p>
              <p>End Time: {election.endTime}</p>

              <h4 style={{ marginTop: '20px', fontSize: '16px', fontWeight: 'bold' }}>Candidates</h4>
              <div className="candidates-grid">
                {election.candidates && election.candidates.map((candidate, idx) => (
                  <div key={idx} className="candidate-card">
                    <p>Name: {candidate.firstName} {candidate.lastName}</p>
                    <p>Party: {candidate.party}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
