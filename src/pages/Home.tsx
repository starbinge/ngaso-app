import { useState, useEffect, startTransition } from 'react';
import { tmdb } from '../api/tmdb';
import { countries } from '../api/countries';
import MediaCard from '../components/MediaCard';
import type { Movie, TVShow } from '../types/tmdb';

export default function Home() {
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [topTV, setTopTV] = useState<TVShow[]>([]);
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(() => setLoading(true));
    Promise.all([
      tmdb.trending('all', 'week'),
      tmdb.popularMovies(),
      tmdb.popularTV(),
      tmdb.topMoviesByCountry(country),
      tmdb.topTVByCountry(country),
    ]).then(([trend, movies, tv, topM, topT]) => {
      setTrending(trend.results.slice(0, 18));
      setPopularMovies(movies.results.slice(0, 18));
      setPopularTV(tv.results.slice(0, 18));
      setTopMovies(topM.results.slice(0, 10));
      setTopTV(topT.results.slice(0, 10));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [country]);

  if (loading) return <div className="page-content"><div className="spinner" /></div>;

  const renderGrid = (items: (Movie | TVShow)[]) => (
    <div className="grid">
      {items.map(item => (
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
  );

  const countryName = countries.find(c => c.code === country)?.name || country;

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Discover</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Country:</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="select-minimal">
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <section style={{ marginBottom: 40 }}>
          <h2 className="section-title">Trending This Week</h2>
          {renderGrid(trending)}
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="section-title">Top 10 Movies in {countryName}</h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {topMovies.map((movie, i) => (
              <div key={movie.id} style={{ minWidth: 160, maxWidth: 160, position: 'relative', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', top: 4, left: 4, zIndex: 2,
                  background: 'var(--accent)', color: '#fff', width: 28, height: 28,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}>
                  {i + 1}
                </div>
                <MediaCard
                  id={movie.id} title={movie.title} poster={movie.poster_path}
                  year={movie.release_date} rating={movie.vote_average} mediaType="movie"
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="section-title">Top 10 TV Series in {countryName}</h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {topTV.map((show, i) => (
              <div key={show.id} style={{ minWidth: 160, maxWidth: 160, position: 'relative', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', top: 4, left: 4, zIndex: 2,
                  background: 'var(--accent)', color: '#fff', width: 28, height: 28,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}>
                  {i + 1}
                </div>
                <MediaCard
                  id={show.id} title={show.name} poster={show.poster_path}
                  year={show.first_air_date} rating={show.vote_average} mediaType="tv"
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="section-title">Popular Movies</h2>
          {renderGrid(popularMovies)}
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="section-title">Popular TV Shows</h2>
          {renderGrid(popularTV)}
        </section>
      </div>
    </div>
  );
}
