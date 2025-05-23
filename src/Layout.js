import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Layout.css';

export default function Layout() {
  const { user, role } = useUser();

  return (
    <div className='layout-container'>
       <header className='custom-header'>
        <h2>Ληθιλεξικόν</h2>
        <nav>
          <Link to="/">Home</Link> |{' '}
          {!user && <Link to="/register">Register</Link>}
          {!user && <Link to="/login">Login</Link>} 
          {user && <Link to="/submit">Submit</Link>} 
          {user && <Link to="/profile">My Profile</Link>} 
          {user && role === 'admin' && <Link to="/admin">Admin</Link>}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Ληθιλεξικόν. All rights reserved.</p>
      </footer>
    </div>
  );
}
