import { Link } from 'react-router-dom';
import { useState } from 'react';
import SearchDialog from './SearchDialog';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px' }}>
          NGASO
        </Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Home
          </Link>
          <Link to="/browse" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Browse
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              padding: '8px 16px', borderRadius: 4, border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              fontSize: '0.85rem', width: 220, textAlign: 'left', cursor: 'text',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            Search movies & TV...
          </button>
        </div>
      </nav>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
