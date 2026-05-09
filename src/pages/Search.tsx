import { useState, useEffect, startTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb } from '../api/tmdb';
import MediaCard from '../components/MediaCard';
import type { Movie, TVShow } from '../types/tmdb';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) { startTransition(() => setResults([])); return; }
    startTransition(() => setLoading(true));
    tmdb.searchMulti(query)
      .then(data => {
        const filtered = data.results.filter(
          (item): item is Movie | TVShow =>
            item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="page-content">
      <div className="container">
        <h2 className="section-title" style={{ marginBottom: 24 }}>
          {query ? `Results for "${query}"` : 'Search movies & TV shows'}
        </h2>

        {loading && <div className="spinner" />}

        {!loading && results.length === 0 && query && (
          <p style={{ color: 'var(--text-muted)' }}>No results found.</p>
        )}

        {!query && !loading && (
          <p style={{ color: 'var(--text-muted)' }}>Type something in the search bar above.</p>
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
                mediaType={'title' in item ? 'movie' : 'tv'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
