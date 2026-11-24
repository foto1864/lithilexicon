import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import '../styles/Layout.css';
import LetterNav from './LetterNav';
import SearchBar from './SearchBar';

export default function Layout() {
  const { user, role, profileError } = useUser();
  const [logoutError, setLogoutError] = useState('');
  const handleLogout = async () => {
    setLogoutError('');
    try { await signOut(auth); } catch { setLogoutError('Η αποσύνδεση απέτυχε. Δοκιμάστε ξανά.'); }
  };
  return (
    <div className="layout-container">
      <a className="skip-link" href="#main-content">Μετάβαση στο περιεχόμενο</a>
      <header className="custom-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Ληθιλεξικόν — Αρχική">
            <span className="brand-mark" aria-hidden="true">λ.</span>
            <span>Ληθιλεξικόν<small>ΛΕΞΕΙΣ ΠΟΥ ΑΞΙΖΕΙ ΝΑ ΘΥΜΟΜΑΣΤΕ</small></span>
          </Link>
          <nav className="main-nav" aria-label="Κύρια πλοήγηση">
            <NavLink to="/" end>Αρχική</NavLink>
            <NavLink to="/about">Σχετικά</NavLink>
            {!user && <NavLink to="/login">Σύνδεση</NavLink>}
            {user && <NavLink to="/profile">Προφίλ</NavLink>}
            {user && <button type="button" onClick={handleLogout}>Αποσύνδεση</button>}
            {user && role === 'admin' && <NavLink to="/admin">Διαχείριση</NavLink>}
            <Link className="nav-contribute" to={user ? '/submit' : '/login'}>+ Προσθήκη φράσης</Link>
          </nav>
        </div>
        <div className="discovery-bar"><div className="discovery-inner"><SearchBar /><span className="browse-label">Περιήγηση ανά γράμμα</span><LetterNav /></div></div>
      </header>
      <main id="main-content" tabIndex="-1">{(profileError || logoutError) && <p className="section-content" role="alert">{profileError || logoutError}</p>}<Outlet /></main>
      <footer><div className="footer-inner"><Link className="footer-brand" to="/">Ληθιλεξικόν<span>Η γλώσσα μας έχει μνήμη.</span></Link><p>© {new Date().getFullYear()} Ληθιλεξικόν · <Link to="/about">Σχετικά</Link> · <Link to="/about#epikoinonia">Επικοινωνία</Link></p><Link to={user ? '/submit' : '/register'}>Γίνε μέρος της συλλογής ↗</Link></div></footer>
    </div>
  );
}
