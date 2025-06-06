import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

// Imports
import { auth } from '../utils/firebase';
import { useUser } from '../user/UserContext';
import '..//styles/Home.css';

export default function Home() {
  const { user, role, loading } = useUser();
  const navigate = useNavigate();

  // Εδώ βάζεις τις χειροκίνητες "επιλεγμένες" φράσεις
  const featured = [
    {
      phrase: 'Άρον άρον',
      meaning: 'Με μεγάλη βιασύνη',
      uploadedBy: 'foto'
    },
    {
      phrase: 'Μπανάλ',
      meaning: 'Πολυχρησιμοποιημένο',
      uploadedBy: 'maestros'
    },
    {
      phrase: 'Στου κουφού την πόρτα όσο θέλεις βρόντα',
      meaning: 'Δεν έχει νόημα να προσπαθείς για κάτι ανώφελο',
      uploadedBy: 'foto'
    },
    {
      phrase: 'Φιρί φιρί',
      meaning: 'Επίμονα και προκλητικά',
      uploadedBy: 'Madame Coco'
    }
  ];

  return (
    <div>
      <h1>Ληθιλεξικόν - Αρχική</h1>

      <nav>
        <ul>
          <li><Link to="/">Αρχική</Link></li>
          {!user && <li><Link to="/register">Register</Link></li>}
          {!user && <li><Link to="/login">Σύνδεση</Link></li>}
          {user && <li><Link to="/submit">Υποβολή Φράσης</Link></li>}
          {user && role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
          {user && role === 'subscriber' && <li><Link to="/profile">Προφίλ</Link></li>}
          {user && <li><button onClick={() => { signOut(auth).then(() => navigate('/')); }}>Αποσύνδεση</button></li>}
        </ul>
      </nav>

      {loading ? (
        <p>Loading user...</p>
      ) : user ? (
        <p>Welcome <strong>{user.email}</strong> — Role: <strong>{role}</strong></p>
      ) : (
        <p>You are not logged in.</p>
      )}

      <hr />

      <div className='align-nav'>
      </div>

      <h2>Επιλεγμένες Φράσεις</h2>
      <ul>
        {featured.map((entry, index) => (
          <li key={index}>
            <strong>{entry.phrase}</strong>: {entry.meaning} — uploaded by {entry.uploadedBy}
          </li>
        ))}
      </ul>
    </div>
  );
}
