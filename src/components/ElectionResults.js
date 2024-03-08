import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contractInstance } from './sharedVariables';

function ElectionResultsPage() {
  const [pastElectionResults, setPastElectionResults] = useState([]);
  const { electionName } = useParams();

  useEffect(() => {
    const fetchPastElectionResults = async () => {
      try {
        const electionResult = await contractInstance.getElectionResult(electionName);
        const electionCandidates = electionResult[1];
        const electionVotes = electionResult[2];

        // Combine candidate names and votes into an array of objects
        const candidateVotePairs = electionCandidates.map((candidateName, index) => ({
          name: candidateName,
          votes: electionVotes[index]
        }));
        console.log(candidateVotePairs[0].votes);
        // Sort the array based on votes in descending order
        candidateVotePairs.sort((a, b) => Number(b.votes.toString()) - Number(a.votes.toString()));
        
        // Find the winner (candidate with maximum votes)
        const winner = candidateVotePairs[0];

        // Update state with sorted candidateVotePairs and winner
        setPastElectionResults({ candidateVotePairs, winner });
      } catch (error) {
        console.error('Error fetching election results:', error);
      }
    };

    fetchPastElectionResults();
  }, [electionName]);

  return (
    <div className="ElectionResultsPage">
      <h2>Election Results for {electionName} elections</h2>
      <div>
        {pastElectionResults.candidateVotePairs && pastElectionResults.candidateVotePairs.map((result, index) => (
          <div key={index} className="election-card">
            <h3>{result.name}</h3>
            <p>Votes: {Number(result.votes)}</p>
          </div>
        ))}
        {pastElectionResults.winner && (
          <div className="winner">
            <h3>Winner</h3>
            <p>{pastElectionResults.winner.name}: {pastElectionResults.winner.votes} votes</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ElectionResultsPage;
