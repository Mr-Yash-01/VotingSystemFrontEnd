import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

function VoterDash() {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const navigate = useNavigate();
  const { voterId } = useParams();

  useEffect(() => {
    // Function to fetch upcoming elections data from Firebase Realtime Database
    const fetchUpcomingElections = () => {
      const db = getDatabase(app);
      const electionsRef = ref(db, 'Elections');

      onValue(electionsRef, (snapshot) => {
        const data = snapshot.val();
        delete data['safe'];
        if (data) {
          const currentTime = new Date();
          const upcomingElectionsArray = Object.entries(data).filter(([key, value]) => {
            const startTime = new Date(value.startTime);
            const endTime = new Date(value.endTime);
            // Check if the election is ongoing or upcoming
            return startTime > currentTime || endTime > currentTime;
          });
          setUpcomingElections(upcomingElectionsArray);
        } else {
          setUpcomingElections([]);
        }
      });
    };

    // Initial fetch
    fetchUpcomingElections();

    // Set up interval to periodically check for updates
    const interval = setInterval(fetchUpcomingElections, 1000); // Update every second

    // Cleanup function to clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleElectionClick = (electionKey, endTime) => {
    const currentTime = new Date();
    if (currentTime < new Date(endTime)) {
      navigate(`/election-page/${electionKey}/${voterId}`);
    } else {
      // Print the result
      const db = getDatabase(app);
      const candidatesRef = ref(db, `Elections/${electionKey}/candidates`);

      onValue(candidatesRef, (snapshot) => {
        const candidates = snapshot.val();
        if (candidates) {
          console.log("Election Result:");
          Object.entries(candidates).forEach(([candidateId, candidate]) => {
            console.log(`Candidate ${candidateId}: ${candidate.firstName} ${candidate.lastName}, Votes: ${candidate.votes}`);
          });
        }
      });
    }
  };

  return (
    <div className="VoterDash">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Voter Dashboard</h2>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Upcoming Elections</h3>
        <div className="elections-grid">
          {upcomingElections.map(([key, value]) => (
            <div key={key} className="election-card" onClick={() => handleElectionClick(key, value.endTime)} style={{ display: (new Date(value.startTime) > new Date()) || (new Date(value.endTime) < new Date()) ? 'none' : 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
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
