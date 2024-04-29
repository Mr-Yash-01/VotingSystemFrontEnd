import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';


// Import Font Awesome CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

function VoterDash() {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { voterId } = useParams();

  useEffect(() => {
    const fetchUpcomingElections = () => {
      const db = getDatabase(app);
      const electionsRef = ref(db, 'Elections');

      onValue(electionsRef, (snapshot) => {
        const data = snapshot.val();
        delete data['safe'];
        if (data) {
          const upcomingElectionsArray = Object.entries(data);
          setUpcomingElections(upcomingElectionsArray);
        } else {
          setUpcomingElections([]);
        }
      });
    };

    fetchUpcomingElections();

    const interval = setInterval(fetchUpcomingElections, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleElectionClick = (electionKey, electionName) => {
    navigate(`/election-page/${electionKey}/${voterId}/${electionName}`);
  };

  const handleResults = (electionName) => {
    navigate(`/election-results/${electionName}`);
  };

  const filteredElections = upcomingElections.filter(([key, value]) =>
    value.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="VoterDash">
      <h2 style={{ fontSize: '38px', fontWeight: 'bold', textAlign: 'center' }}>Voter Dashboard</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <input
          type="text"
          placeholder= " Search election name..."
                    onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '500px', // Adjust width as needed
            height: '20px',
            border: '1px solid',
            borderRadius: '1220px', // Make it oval
            padding: '10px',
            fontSize: '16px',
          }}
        />
      </div>

      {/* Horizontal line above running elections */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginLeft: '27px' }}>Running Elections :</h3>
        <div className="elections-grid">
          {filteredElections.filter(([key, value]) => new Date(value.startTime) < new Date() && new Date(value.endTime) > new Date()).length === 0 && <p className="no-election-message">No running elections</p>}
          {filteredElections.map(([key, value]) => (
            new Date(value.startTime) < new Date() && new Date(value.endTime) > new Date() && (
              <div key={key} className="election-card running-elections" onClick={() => handleElectionClick(key, value.name)} style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{value.name}</h4>
                <p>Start Time: {new Date(value.startTime).toLocaleString()}</p>
                <p>End Time: {new Date(value.endTime).toLocaleString()}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Horizontal line above no election message */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold',  marginLeft: '27px' }}>Upcoming Elections :</h3>
        <div className="elections-grid">
          {filteredElections.filter(([key, value]) => new Date(value.startTime) > new Date()).length === 0 && <p className="no-election-message">No upcoming elections</p>}
          {filteredElections.map(([key, value]) => (
            new Date(value.startTime) > new Date() && (
              <div key={key} className="election-card upcoming-elections" style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{value.name}</h4>
                <p>Start Time: {new Date(value.startTime).toLocaleString()}</p>
                <p>End Time: {new Date(value.endTime).toLocaleString()}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Horizontal line above ended elections */}
      <hr style={{ marginTop: '20px', marginBottom: '20px', borderTop: '2px solid #ccc' }} />

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginLeft: '27px' }}>Ended Elections :</h3>
        <div className="elections-grid">
          {filteredElections.filter(([key, value]) => new Date(value.endTime) < new Date()).length === 0 && <p className="no-election-message">No ended elections</p>}
          {filteredElections.map(([key, value]) => (
            new Date(value.endTime) < new Date() && (
              <div key={key} className="election-card ended-elections" onClick={() => handleResults(value.name)} style={{ display: 'block', cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{value.name}</h4>
                <p>Start Time: {new Date(value.startTime).toLocaleString()}</p>
                <p>End Time: {new Date(value.endTime).toLocaleString()}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoterDash;
