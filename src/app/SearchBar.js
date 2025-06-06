import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Redirect όταν έχει πάνω από 1 χαρακτήρα
    if (value.trim().length >= 2) {
      navigate(`/search?query=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Αναζήτηση φράσης..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}
