import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };
  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
      <input type="search" aria-label="Αναζήτηση λέξης ή φράσης" placeholder="Αναζήτησε μια λέξη ή φράση…" value={query} onChange={event => setQuery(event.target.value)} />
      <button type="submit" aria-label="Αναζήτηση">↵</button>
    </form>
  );
}
