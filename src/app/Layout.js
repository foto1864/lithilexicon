import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import '../styles/Layout.css';
import LetterNav from './LetterNav';
import SearchBar from './SearchBar';

export default function Layout() {
  const { user, role } = useUser();
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
            {!user && <NavLink to="/login">Σύνδεση</NavLink>}
            {user && <NavLink to="/profile">Προφίλ</NavLink>}
            {user && role === 'admin' && <NavLink to="/admin">Διαχείριση</NavLink>}
            <Link className="nav-contribute" to={user ? '/submit' : '/login'}>+ Προσθήκη φράσης</Link>
          </nav>
        </div>
        <div className="discovery-bar"><div className="discovery-inner"><SearchBar /><span className="browse-label">Περιήγηση ανά γράμμα</span><LetterNav /></div></div>
      </header>
      <main id="main-content" tabIndex="-1"><Outlet /></main>
      <footer><div className="footer-inner"><Link className="footer-brand" to="/">Ληθιλεξικόν<span>Η γλώσσα μας έχει μνήμη.</span></Link><p>© {new Date().getFullYear()} Ληθιλεξικόν</p><Link to={user ? '/submit' : '/register'}>Γίνε μέρος της συλλογής ↗</Link></div></footer>
    </div>
  );
}
