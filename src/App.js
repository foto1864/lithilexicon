import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import from 'auth'
import Register from './/auth/Register';
import Login from './/auth/Login';
import ForgotPassword from './/auth/ForgotPassword';

// Import from 'app'
import SubmitPreview from './/app/SubmitPreview';
import LetterPage from './/app/LetterPage';
import SearchResults from './app/SearchResults';

// Import from current
import Home from './/app/Home';
import Submit from './/app/Submit';
import Layout from './/app/Layout';

// Import from 'admin'
import AdminDashboard from './/admin/AdminDashboard';

// Import from 'user'
import Profile from './/user/Profile';

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
          <Route path="/submit-preview" element={<SubmitPreview />} />
          <Route path="/letter/:letter" element={<LetterPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
