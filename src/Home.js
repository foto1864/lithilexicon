import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

export default function Home() {
  const { user, role, loading } = useUser();

  return (
    <div>
      <h1>Ληθιλεξικόν - Home</h1>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {!user && <li><Link to="/register">Register</Link></li>}
          {!user && <li><Link to="/login">Login</Link></li>}
          {user && <li><Link to="/submit">Submit Phrase</Link></li>}
          {user && <li><button onClick={() => window.location.reload()}>Logout</button></li>}
        </ul>
      </nav>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <p>Welcome <strong>{user.email}</strong> — Role: <strong>{role}</strong></p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
