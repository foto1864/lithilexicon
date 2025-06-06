import React from 'react';
import { Outlet, Link } from 'react-router-dom';

// Import from 'user'
import { useUser } from '..//user/UserContext';

// Import from 'styles'
import '..//styles/Layout.css';

// Import from current
import LetterNav from './LetterNav';

export default function Layout() {
  const { user, role } = useUser();

  return (
    <div className='layout-container'>
       <header className='custom-header'>
        <h2>Ληθιλεξικόν</h2>
        <nav>
          <Link to="/">Αρχική</Link>
          {!user && <Link to="/login">Σύνδεση</Link>} 
          {user && <Link to="/submit">Υποβολή Φράσης</Link>} 
          {user && <Link to="/profile">Προφίλ</Link>} 
          {user && role === 'admin' && <Link to="/admin">Admin</Link>}
        </nav>

        <LetterNav />

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
