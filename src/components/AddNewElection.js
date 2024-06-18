import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase';
import { sendContract } from './sharedVariables';
import { useNavigate } from 'react-router-dom';

function AddNewElection() {
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [isValidForm, setIsValidForm] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  // Define handleAddCandidate function
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
  
  // Define a debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Debounce the handleAddCandidate function with a delay of 300 milliseconds
  const debouncedHandleAddCandidate = debounce(handleAddCandidate, 300);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setCandidateName(value);
  };

  // Use the debouncedHandleAddCandidate function in the onClick event handler
  const handleAddCandidateClick = () => {
    debouncedHandleAddCandidate();
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
      candidates: candidates.map((candidate) => candidate.name), // Extract only candidate names
      voted: {
        safe: '',
      },
    };
  
    try {
      // Send transaction to MetaMask for user confirmation
      await sendContract.addElectionWithCandidates(electionName, electionData.candidates);
  
      // If transaction is successful, update database
      await push(electionRef, electionData);
      
      // Navigate to admin dashboard upon successful deployment
      navigate('/admin-dashboard');
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the transaction in MetaMask
        console.log('Transaction rejected by user.');
        // You can choose to do nothing here or handle it as needed
      } else {
        // Other errors (e.g., network issues, contract errors)
        console.error('Error during transaction:', error);
        // Handle other errors accordingly
      }
    }
  };
  

  return (
    <div className="AddNewElectionBox">
      <div className="OvalBox">
        <h2>Add New Election</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Election Name  
            <input type="text" value={electionName} onChange={(e) => setElectionName(e.target.value)} />
          </label>
          <label>
            Start Time
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <label>
            End Time
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
          <div className="candidate-input">
            <label>Candidate</label>
            <input type="text" value={candidateName} onChange={handleInputChange} />
            <button type="button" className='addCandidate' onClick={handleAddCandidateClick}>
              {editingIndex !== null ? 'Update ' : 'Add '}
            </button>
          </div>
          <button type="submit">Submit</button>
          {!isValidForm && <p>Please fill all fields correctly.</p>}
        </form>

        <div className="candidate-tiles">
          {candidates.map((candidate, index) => (
            <div className="candidate-tile" key={index}>
              <div className="candidate-info">
                <span className="candidate-name">{candidate.name}</span>
                <div className="candidate-buttons">
                  <button type="button" onClick={() => handleEditCandidate(index)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleRemoveCandidate(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddNewElection;
