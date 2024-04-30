import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contractInstance } from './sharedVariables';
import { useSpring, animated } from 'react-spring';

function ElectionResultsPage() {
  const [pastElectionResults, setPastElectionResults] = useState([]);
  const { electionName } = useParams();

  useEffect(() => {
    const fetchPastElectionResults = async () => {
      try {
        const electionResult = await contractInstance.getElectionResult(electionName);
        const electionCandidates = electionResult[1];
        const electionVotes = electionResult[2];

        const candidateVotePairs = electionCandidates.map((candidateName, index) => ({
          name: candidateName,
          votes: electionVotes[index]
        }));

        candidateVotePairs.sort((a, b) => Number(b.votes.toString()) - Number(a.votes.toString()));

        const winner = candidateVotePairs[0];

        // Check for tie
        const isTie = candidateVotePairs.every(candidate => candidate.votes === winner.votes);

        if (isTie) {
          setPastElectionResults({ isTie, candidateVotePairs });
        } else {
          setPastElectionResults({ candidateVotePairs, winner });
        }
      } catch (error) {
        console.error('Error fetching election results:', error);
      }
    };

    fetchPastElectionResults();
  }, [electionName]);

  const winnerAnimation = useSpring({
    to: { opacity: 1, transform: 'scale(1)' },
    from: { opacity: 0, transform: 'scale(0.5)' },
    reset: true,
    delay: 200,
    config: { duration: 500 }
  });

  return (
    <div className="ElectionResultsPage">
      <h2>Election Results for {electionName} elections</h2>
      <div className="square-box">
        <div className="results-container">
          {pastElectionResults.candidateVotePairs && pastElectionResults.candidateVotePairs.map((result, index) => (
            <div key={index} className="candidate-tile">
              <p className="candidate-name">{result.name}</p>
              <p className="votes">Votes: {Number(result.votes)}</p>
            </div>
          ))}
          {pastElectionResults.isTie && (
            <div className="tie-tile">
              <p className="tie-label">Tie &#128522;</p>
            </div>
          )}
          {pastElectionResults.winner && !pastElectionResults.isTie && (
            <animated.div style={winnerAnimation} className="winner-tile">
              <p className="winner-label">&#127881; Congratulations, Winner! &#127881;</p>
              <p className="winner-name">{pastElectionResults.winner.name}</p>
              <p className="votes">Votes: {Number(pastElectionResults.winner.votes)}</p>
            </animated.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElectionResultsPage;
