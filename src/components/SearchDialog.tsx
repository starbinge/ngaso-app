import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdb, getImg } from '../api/tmdb';
import type { Movie, TVShow } from '../types/tmdb';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      startTransition(() => { setQuery(''); setResults([]); setSearched(false); });
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      startTransition(() => { setResults([]); setSearched(false); });
      return;
    }
    startTransition(() => { setLoading(true); setSearched(false); });
    const timer = setTimeout(() => {
      tmdb.searchMulti(query.trim())
        .then(data => {
          const filtered = data.results.filter(
            (item): item is Movie | TVShow =>
              item.media_type === 'movie' || item.media_type === 'tv'
          );
          setResults(filtered);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
          setSearched(true);
        });
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSelect = useCallback((item: Movie | TVShow) => {
    const type = 'title' in item ? 'movie' : 'tv';
    onClose();
    navigate(`/${type}/${item.id}`);
  }, [onClose, navigate]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 600, padding: '0 20px' }}
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies & TV..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '16px 20px', fontSize: '1.2rem', fontWeight: 500,
            borderRadius: 12, border: '2px solid var(--accent)',
            background: 'var(--bg-elevated)', color: 'var(--text-primary)',
            outline: 'none', transition: 'border-color 0.2s',
          }}
        />

        <div style={{ marginTop: 24 }}>
          {!query && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Type to search movies & TV shows
            </p>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 8 }}>
                  <div className="skeleton" style={{ width: 72, height: 48, borderRadius: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '40%', height: 11 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</p>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: '50vh', overflowY: 'auto' }}>
              {results.slice(0, 10).map(item => {
                const title = 'title' in item ? item.title : item.name;
                const year = ('release_date' in item ? item.release_date : item.first_air_date)?.split('-')[0] || '';
                const type = 'title' in item ? 'Movie' : 'TV';
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      display: 'flex', gap: 12, padding: 10, borderRadius: 8, border: 'none',
                      background: 'transparent', cursor: 'pointer', textAlign: 'left',
                      color: 'var(--text-primary)', transition: 'background 0.15s',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 72, minWidth: 72, aspectRatio: '2/3', borderRadius: 4, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                      {item.poster_path ? (
                        <img src={getImg(item.poster_path, 'w92')} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.55rem' }}>
                          No Img
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {type} · {year || '—'}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      ★ {item.vote_average.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
