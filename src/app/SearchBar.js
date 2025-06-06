import React, { useState } from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.trim());
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
