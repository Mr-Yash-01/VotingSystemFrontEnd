import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { app } from '../firebase';

function ElectionPage() {
  const { electionId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [votedCandidate, setVotedCandidate] = useState(null);

  // Function to handle vote click
  const handleVote = (candidateId) => {
    // Check if user has already voted
    if (votedCandidate) {
      alert('You have already voted. You can only vote once.');
      return;
    }

    // Update database to increment vote count for the selected candidate
    const db = getDatabase(app);
    const candidateRef = ref(db, `Elections/${electionId}/candidates/${candidateId}`);
    update(candidateRef, { votes: candidates[candidateId].votes + 1 })
      .then(() => {
        console.log('Vote counted successfully');
        setVotedCandidate(candidateId); // Mark user as voted for this candidate
      })
      .catch((error) => {
        console.error('Error updating vote count:', error);
      });
  };

  // Fetch candidates data from the database
  useEffect(() => {
    const db = getDatabase(app);
    const candidatesRef = ref(db, `Elections/${electionId}/candidates`);

    onValue(candidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCandidates(data);
      } else {
        setCandidates([]);
      }
    });
  }, [electionId]);

  return (
    <div className="ElectionPage">
      <h2>Election Page</h2>
      <div className="candidates-grid">
        {Object.entries(candidates).map(([candidateId, candidate]) => (
          <div key={candidateId} className="candidate-card">
            <p>Name: {candidate.firstName} {candidate.lastName}</p>
            <p>Party: {candidate.party}</p>
            {/* Button to vote for the candidate */}
            <button onClick={() => handleVote(candidateId)} disabled={votedCandidate !== null}>
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElectionPage;
