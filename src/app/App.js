import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Submit from './Submit';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="submit" element={<Submit />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
