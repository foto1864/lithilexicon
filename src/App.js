import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Submit from './Submit';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><Home /></div>} />
        <Route path="/register" element={<div><Register /></div>} />
        <Route path="/login" element={<div><Login /></div>} />
        <Route path="/submit" element={<div><Submit /></div>} />
        <Route path="/admin" element={<div><AdminDashboard /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
