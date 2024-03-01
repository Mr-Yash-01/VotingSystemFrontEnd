import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref,update, onValue,runTransaction } from 'firebase/database';
import { app } from '../firebase';

function ElectionPage() {
  const { electionId, voterId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [votedCandidates, setVotedCandidates] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const votedRef = ref(db, `Elections/${electionId}/voted`);

    // Fetch the existing voted candidates
    onValue(votedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const votedCandidateIds = Object.keys(data);
        setVotedCandidates(votedCandidateIds);
      } else {
        setVotedCandidates([]);
      }
    });
  }, [electionId]);

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

  const handleVote = (candidateId, voterId) => {
    // Get a reference to the candidate's vote count
    const db = getDatabase(app);
    const candidateRef = ref(db, `Elections/${electionId}/candidates/${candidateId}/votes`);

    // Run a transaction to safely update the vote count
    runTransaction(candidateRef, (currentVotes) => {
        // If the currentVotes is null, it means no votes have been cast yet
        // Set it to 1 as the initial vote
        if (currentVotes === null) {
            return 1;
        } else {
            // Increment the current vote count by 1
            return currentVotes + 1;
        }
    })
    .then(() => {
        console.log('Vote counted successfully');
        // Add the voterId under the electionId with its value
        const electionVoterRef = ref(db, `Elections/${electionId}/voted`);
        console.log(voterId);
        return update(electionVoterRef, {
            [voterId]: "" // Assuming you want to set it to true
        });
    })
    .catch((error) => {
        console.error('Error updating vote count:', error);
    });
};





  return (
    <div className="ElectionPage">
      <h2>Election Page</h2>
      <div className="candidates-grid">
        {Object.entries(candidates).map(([candidateId, candidate]) => (
          <div key={candidateId} className="candidate-card">
            <p>Name: {candidate.firstName} {candidate.lastName}</p>
            <p>Party: {candidate.party}</p>
            <button onClick={() => handleVote(candidateId,voterId)} disabled={votedCandidates.includes(voterId)}>
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElectionPage;
