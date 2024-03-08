import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref,update, onValue } from 'firebase/database';
import { app } from '../firebase';
import { sendContract } from './sharedVariables';

function ElectionPage() {
  const { electionId, voterId,electionName } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [votedCandidates, setVotedCandidates] = useState([]);
  console.log(electionId,voterId,electionName);
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

  const handleVote = async (candidate) => {
    console.log(electionName, candidate);
    try {
      const sendData = await sendContract.vote(electionName, candidate);
      await sendContract.waitForDeployment();
      // Get a reference to the candidate's vote count
      const db = getDatabase(app);
      const electionVoterRef = ref(db, `Elections/${electionId}/voted`);
      // Run a transaction to safely update the vote count
      await update(electionVoterRef, {
        [voterId]: sendData.hash // Assuming you want to set it to the transaction hash
      });
      console.log('Uploaded');
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };
  

return (
  <div className="ElectionPage">
    <h2>Election Page</h2>
    <div className="candidates-grid">
      {Object.entries(candidates).map(([candidateId, candidate]) => (
        <div key={candidateId} className="candidate-card">
          <p>Name: {candidate} </p>
          <button onClick={() => handleVote(candidate)} disabled={votedCandidates.includes(voterId)}>
            Vote
          </button>
        </div>
      ))}
    </div>    
  </div>
);
}

export default ElectionPage;
