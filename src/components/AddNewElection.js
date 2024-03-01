import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase';

function AddNewElection() {
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    party: ''
  });
  const [isValidForm, setIsValidForm] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidateInfo({
      ...candidateInfo,
      [name]: value
    });
  };

  const handleAddCandidate = () => {
    const isValidCandidate =
      candidateInfo.firstName.trim() !== '' &&
      candidateInfo.lastName.trim() !== '' &&
      candidateInfo.middleName.trim() !== '' &&
      candidateInfo.party.trim() !== '';
    if (isValidCandidate) {
      const newCandidate = {
        ...candidateInfo,
        votes: 0 // Initialize votes to 0 when adding a new candidate
      };

      if (editingIndex !== null) {
        const updatedCandidates = [...candidates];
        updatedCandidates[editingIndex] = newCandidate;
        setCandidates(updatedCandidates);
        setEditingIndex(null);
      } else {
        setCandidates([...candidates, newCandidate]);
      }
      setCandidateInfo({
        firstName: '',
        lastName: '',
        middleName: '',
        party: ''
      });
      setIsValidForm(true);
    } else {
      setIsValidForm(false);
    }
  };

  const handleEditCandidate = (index) => {
    const candidate = candidates[index];
    setEditingIndex(index);
    setCandidateInfo(candidate);
  };

  const handleRemoveCandidate = (index) => {
    const updatedCandidates = [...candidates];
    updatedCandidates.splice(index, 1);
    setCandidates(updatedCandidates);
  };

  const handleSubmit = (event) => {
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
      candidates: candidates,
      voted:""
    };

    push(electionRef, electionData)
      .then(() => {
        console.log('Election data uploaded successfully');
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
          <label>First Name:</label>
          <input type="text" name="firstName" value={candidateInfo.firstName} onChange={handleInputChange} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={candidateInfo.lastName} onChange={handleInputChange} />
        </div>
        <div>
          <label>Middle Name:</label>
          <input type="text" name="middleName" value={candidateInfo.middleName} onChange={handleInputChange} />
        </div>
        <div>
          <label>Political Party:</label>
          <input type="text" name="party" value={candidateInfo.party} onChange={handleInputChange} />
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
              {candidate.firstName} {candidate.lastName} - {candidate.party}
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
