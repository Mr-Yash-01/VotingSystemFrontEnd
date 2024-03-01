import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LogIn from './components/LogIn';
import VoterDash from './components/VoterDash';
import AdminDash from './components/AdminDash';
import ElectionPage from './components/ElectionPage';
import AddNewVoter from './components/AddNewVoter';
import AddNewElection from './components/AddNewElection';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LogIn />} />
          <Route path="/voter-dashboard" element={<VoterDash />} />
          <Route path="/admin-dashboard" element={<AdminDash />} />
          <Route path="/election-page" element={<ElectionPage />} />
          <Route path="/add-new-voter" element={<AddNewVoter />} />
          <Route path="/add-new-election" element={<AddNewElection />} />
          <Route path="/election-page/:electionId" element={<ElectionPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;