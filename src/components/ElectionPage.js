import React, { useState, useEffect } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { app } from '../firebase';
import { sendContract } from './sharedVariables';

function ElectionPage() {
  const { electionId, voterId, electionName } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [votedCandidates, setVotedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

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

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    try {
      const sendData = await sendContract.vote(electionName, selectedCandidate);
      await sendContract.waitForDeployment();
  
      const db = getDatabase(app);
      const electionVoterRef = ref(db, `Elections/${electionId}/voted`);
  
      await update(electionVoterRef, {
        [voterId]: sendData.hash
      });
  
      console.log('Vote successfully recorded');
      setShowConfirmation(false);
      navigate(`/voter-dashboard/${voterId}`);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the transaction in MetaMask
        console.log('Transaction rejected by user.');
        // Handle rejection gracefully (e.g., show a message to the user)
      } else {
        // Other errors (e.g., network issues, contract errors)
        console.error('Error handling vote:', error);
        // Handle other errors accordingly
      }
    }
  };
  

  return (
    <div className="ElectionPage">
      <h2>Election Page</h2>
      <div className="candidates-grid">
        {Object.entries(candidates).map(([candidateId, candidate]) => (
          <div key={candidateId} className="candidate-card">
            <p>Name: {candidate}</p>
            <button
  onClick={() => handleVote(candidate)}
  disabled={votedCandidates.includes(voterId)}
  style={{
    backgroundColor: votedCandidates.includes(voterId) ? '#6c7075' : '#0e4eb5',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: votedCandidates.includes(voterId) ? 'not-allowed' : 'pointer'
  }}
>
  Vote
</button>
          </div>
        ))}
      </div>
      {showConfirmation && (
        <>
          <div className="overlay"></div>
          <div className="confirmation-popup">
            <p>Are you sure you want to vote for <strong>{selectedCandidate}?</strong></p>
            <button onClick={confirmVote}>Vote</button>
            <button onClick={() => setShowConfirmation(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ElectionPage;
