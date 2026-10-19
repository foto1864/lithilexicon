import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Layout.css';

const GREEK_ALPHABET = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
  'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π',
  'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
];

export default function LetterNav() {
  return (
    <nav className="letter-nav" aria-label="Αλφαβητικό ευρετήριο">
      {GREEK_ALPHABET.map(letter => (
        <NavLink key={letter} to={`/letter/${letter}`}>
          {letter}
        </NavLink>
      ))}
    </nav>
  );
}
