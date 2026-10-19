import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import '../styles/Home.css';

const featured = [
  { phrase: 'Άρον άρον', meaning: 'Με μεγάλη βιασύνη', uploadedBy: 'foto', letter: 'Α' },
  { phrase: 'Μπανάλ', meaning: 'Πολυχρησιμοποιημένο', uploadedBy: 'maestros', letter: 'Μ' },
  { phrase: 'Στου κουφού την πόρτα όσο θέλεις βρόντα', meaning: 'Δεν έχει νόημα να προσπαθείς για κάτι ανώφελο', uploadedBy: 'foto', letter: 'Σ' },
  { phrase: 'Φιρί φιρί', meaning: 'Επίμονα και προκλητικά', uploadedBy: 'Madame Coco', letter: 'Φ' }
];

export default function Home() {
  const { user, username } = useUser();
  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> ΕΝΑ ΖΩΝΤΑΝΟ ΕΛΛΗΝΙΚΟ ΛΕΞΙΚΟ</p>
          <h1 id="hero-title">Λέξεις που ξεχνιούνται.<br /><em>Ιστορίες που μένουν.</em></h1>
          <p className="hero-description">Ξαναβρίσκουμε τις λέξεις και τις φράσεις της γλώσσας μας. Εκφράσεις που ακούσαμε, αγαπήσαμε και αξίζει να περάσουν στους επόμενους.</p>
          <div className="hero-actions"><a className="button primary" href="#featured">Ανακάλυψε τη συλλογή <span aria-hidden="true">↗</span></a><Link className="text-link" to={user ? '/submit' : '/register'}>Μοιράσου μια φράση <span aria-hidden="true">→</span></Link></div>
          {user && <p className="welcome-note">Καλωσήρθες, {username || 'φίλε της γλώσσας'}.</p>}
        </div>
        <aside className="word-feature" aria-label="Μια φράση από τη συλλογή">
          <div className="word-feature-top"><span>ΑΠΟ ΤΟ ΛΕΞΙΚΟ ΜΑΣ</span><span aria-hidden="true">↗</span></div>
          <span className="decorative-letter" aria-hidden="true">λ</span>
          <div className="word-feature-copy"><span className="word-category">έκφραση</span><h2>Φιρί φιρί</h2><p>Επίμονα και προκλητικά.</p><p className="word-example">«Το πας φιρί φιρί…»</p></div>
          <Link to="/letter/Φ" className="word-feature-bottom">Εξερεύνησε το γράμμα Φ <span aria-hidden="true">→</span></Link>
        </aside>
      </section>
      <section className="featured-section" id="featured" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="eyebrow">ΜΙΚΡΟΙ ΘΗΣΑΥΡΟΙ ΤΗΣ ΓΛΩΣΣΑΣ</p><h2 id="featured-title">Επιλεγμένες φράσεις</h2></div><span className="selection-note">Μια αφορμή για ανακάλυψη</span></div>
        <div className="phrase-grid">{featured.map((entry, index) => <Link className="phrase-card" to={`/search?query=${encodeURIComponent(entry.phrase)}`} key={entry.phrase}><div className="card-top"><span className="letter-badge">{entry.letter}</span><span className="card-number">0{index + 1}</span></div><h3>{entry.phrase}</h3><p>{entry.meaning}</p><div className="card-bottom"><span>Από <strong>{entry.uploadedBy}</strong></span><span className="card-arrow" aria-hidden="true">↗</span></div></Link>)}</div>
      </section>
      <section className="community-banner"><span className="community-symbol" aria-hidden="true">✳</span><div><p className="eyebrow">Η ΣΥΛΛΟΓΗ ΜΕΓΑΛΩΝΕΙ ΜΑΖΙ ΜΑΣ</p><h2>Θυμάσαι μια φράση που λέγατε παλιά;</h2><p>Δώσε της μια θέση εδώ. Κάθε λέξη έχει τη δική της ιστορία.</p></div><Link className="button primary" to={user ? '/submit' : '/register'}>Πρόσθεσε τη δική σου <span aria-hidden="true">+</span></Link></section>
    </div>
  );
}
