import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase';
import { sendContract } from './sharedVariables';

function AddNewElection() {
const [electionName, setElectionName] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [candidates, setCandidates] = useState([]);
const [candidateName, setCandidateName] = useState('');
const [isValidForm, setIsValidForm] = useState(true);
const [editingIndex, setEditingIndex] = useState(null);

const handleInputChange = (event) => {
  const { value } = event.target;
  setCandidateName(value);
};

const handleAddCandidate = () => {
  const isValidCandidate = candidateName.trim() !== '';
  if (isValidCandidate) {
    const newCandidate = {
      name: candidateName,
    };

    if (editingIndex !== null) {
      const updatedCandidates = [...candidates];
      updatedCandidates[editingIndex] = newCandidate;
      setCandidates(updatedCandidates);
      setEditingIndex(null);
    } else {
      setCandidates([...candidates, newCandidate]);
    }
    setCandidateName('');
    setIsValidForm(true);
  } else {
    setIsValidForm(false);
  }
};

const handleEditCandidate = (index) => {
  const candidate = candidates[index];
  setEditingIndex(index);
  setCandidateName(candidate.name);
};

const handleRemoveCandidate = (index) => {
  const updatedCandidates = [...candidates];
  updatedCandidates.splice(index, 1);
  setCandidates(updatedCandidates);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  setIsValidForm(true);

  const db = getDatabase(app);
  const electionRef = ref(db, 'Elections');

  const currentDate = new Date();
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);

  if (
    startTimeDate <= currentDate ||
    endTimeDate <= startTimeDate ||
    electionName.trim() === '' ||
    candidates.length === 0
  ) {
    setIsValidForm(false);
    return;
  }

  const electionData = {
    name: electionName,
    startTime: startTime,
    endTime: endTime,
    candidates: candidates.map(candidate => candidate.name), // Extract only candidate names
    voted: {
      safe : ""
    }
  };

  await sendContract.addElectionWithCandidates(electionName, electionData.candidates);
  push(electionRef, electionData)
    .then(() => {
    })
    .catch((error) => {
      console.error('Error uploading election data:', error);
    });
};

  return (
    <div className="AddNewElection">
      <h2>Add New Election</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Election Name:
          <input type="text" value={electionName} onChange={(e) => setElectionName(e.target.value)} />
        </label>
        <label>
          Start Time:
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <label>
          End Time:
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
        <div>
          <label>Candidate Name:</label>
          <input type="text" value={candidateName} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={handleAddCandidate}>
          {editingIndex !== null ? 'Update Candidate' : 'Add Candidate'}
        </button>
        <button type="submit">Submit</button>
        {!isValidForm && <p>Please fill all fields correctly.</p>}
      </form>
  
      <div className="candidate-list">
        <h3>Candidates:</h3>
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              {candidate.name}
              <button type="button" onClick={() => handleEditCandidate(index)}>Edit</button>
              <button type="button" onClick={() => handleRemoveCandidate(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}

export default AddNewElection;
