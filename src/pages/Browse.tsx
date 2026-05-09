import { useState, useEffect, startTransition } from 'react';
import { tmdb } from '../api/tmdb';
import { countries } from '../api/countries';
import MediaCard from '../components/MediaCard';
import type { Movie, TVShow, Genre } from '../types/tmdb';

type MediaType = 'movie' | 'tv';

export default function Browse() {
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = mediaType === 'movie' ? tmdb.genresMovie() : tmdb.genresTV();
    fetcher.then(data => {
      setGenres(data.genres);
      setSelectedGenre(undefined);
    }).catch(console.error);
  }, [mediaType]);

  useEffect(() => {
    startTransition(() => setLoading(true));
    const fetcher = mediaType === 'movie'
      ? tmdb.discoverMovie(selectedGenre, selectedCountry || undefined)
      : tmdb.discoverTV(selectedGenre, selectedCountry || undefined);
    fetcher.then(data => setResults(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [mediaType, selectedGenre, selectedCountry]);

  return (
    <div className="page-content">
      <div className="container">
        <h2 className="section-title" style={{ marginBottom: 20 }}>Browse</h2>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', borderRadius: 4, padding: 3 }}>
            {(['movie', 'tv'] as MediaType[]).map(t => (
              <button key={t} onClick={() => setMediaType(t)}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: 3, fontSize: '0.85rem', fontWeight: 600,
                  background: mediaType === t ? 'var(--accent)' : 'transparent',
                  color: mediaType === t ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                {t === 'movie' ? 'Movies' : 'TV Series'}
              </button>
            ))}
          </div>

              <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="select-minimal">
            <option value="">All Countries</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <button onClick={() => setSelectedGenre(undefined)}
            style={{
              padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', fontSize: '0.8rem',
              background: !selectedGenre ? 'var(--accent)' : 'transparent',
              color: !selectedGenre ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}>
            All
          </button>
          {genres.map(g => (
            <button key={g.id} onClick={() => setSelectedGenre(g.id)}
              style={{
                padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', fontSize: '0.8rem',
                background: selectedGenre === g.id ? 'var(--accent)' : 'transparent',
                color: selectedGenre === g.id ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
              {g.name}
            </button>
          ))}
        </div>

        {loading && <div className="spinner" />}

        {!loading && results.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No results found.</p>
        )}

        {results.length > 0 && (
          <div className="grid">
            {results.map(item => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={'title' in item ? item.title : item.name}
                poster={item.poster_path}
                year={'release_date' in item ? item.release_date : item.first_air_date}
                rating={item.vote_average}
                mediaType={mediaType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
