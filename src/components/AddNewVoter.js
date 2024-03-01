import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../firebase';

function AddNewVoter() {
  const [voterId, setVoterId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [isValidForm, setIsValidForm] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate voter ID
    if (voterId.trim() === '') {
      setIsValidForm(false);
      return;
    }

    const db = getDatabase(app);
    const voterRef = ref(db, `voters/${voterId}`);

    const voterData = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      dob: dob
    };

    // Set voter data to the database under the provided voter ID
    set(voterRef, voterData)
      .then(() => {
        console.log('Voter added successfully');
        // Clear form fields or show success message
      })
      .catch((error) => {
        console.error('Error adding voter:', error);
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div className="AddNewVoter">
      <h2>Add New Voter</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Voter ID:
          <input type="text" value={voterId} onChange={(e) => setVoterId(e.target.value)} />
        </label>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Middle Name:
          <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Date of Birth:
          <input type="date" value={dob} onChange={(e) => setDOB(e.target.value)} />
        </label>
        <button type="submit">Add Voter</button>
        {!isValidForm && <p>Please enter a valid voter ID.</p>}
      </form>
    </div>
  );
}

export default AddNewVoter;
