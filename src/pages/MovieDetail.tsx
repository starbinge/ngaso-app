import { useState, useEffect, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb, getImg } from '../api/tmdb';
import VidkingPlayer from '../components/VidkingPlayer';
import MediaCard from '../components/MediaCard';
import type { MovieDetail } from '../types/tmdb';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (!id) return;
    startTransition(() => { setLoading(true); setShowPlayer(false); });
    tmdb.movieDetail(Number(id))
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-content"><div className="spinner" /></div>;
  if (!movie) return <div className="page-content"><div className="container"><p style={{ color: 'var(--text-muted)' }}>Movie not found.</p></div></div>;

  const trailer = movie.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');

  return (
    <>
      {movie.backdrop_path && (
        <div className="backdrop" style={{ backgroundImage: `url(${getImg(movie.backdrop_path, 'original')})` }} />
      )}

      <div className="page-content">
        <div className="container">
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ width: 300, minWidth: 200, flexShrink: 0 }}>
              {movie.poster_path ? (
                <img src={getImg(movie.poster_path, 'w500')} alt={movie.title}
                  style={{ width: '100%', borderRadius: 8 }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--bg-elevated)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No Poster
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>{movie.title}</h1>
              {movie.tagline && (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12 }}>{movie.tagline}</p>
              )}

              <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16, flexWrap: 'wrap' }}>
                <span>{movie.release_date?.split('-')[0]}</span>
                <span style={{ color: '#46d369' }}>★ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.runtime} min</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {movie.genres.map(g => (
                  <span key={g.id} style={{
                    padding: '2px 10px', borderRadius: 4, fontSize: '0.8rem',
                    border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  }}>{g.name}</span>
                ))}
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{movie.overview}</p>

              <button onClick={() => setShowPlayer(true)}
                style={{
                  padding: '12px 32px', background: 'var(--accent)', color: '#fff', border: 'none',
                  borderRadius: 4, fontSize: '1rem', fontWeight: 700, transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
                ▶ Play
              </button>

              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
                  style={{
                    marginLeft: 12, padding: '12px 24px', background: 'transparent', color: 'var(--text-primary)',
                    border: '1px solid var(--border)', borderRadius: 4, fontSize: '1rem', fontWeight: 600,
                    display: 'inline-block', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  Trailer
                </a>
              )}
            </div>
          </div>

          {showPlayer && (
            <div style={{ marginBottom: 40 }}>
              <VidkingPlayer mediaType="movie" tmdbId={movie.id} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {movie.credits.cast.slice(0, 10).map(person => (
              <div key={person.id} style={{ textAlign: 'center', width: 80 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-elevated)', marginBottom: 4 }}>
                  {person.profile_path ? (
                    <img src={getImg(person.profile_path, 'w185')} alt={person.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.6rem' }}>
                      No Photo
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {person.name}
                </div>
              </div>
            ))}
          </div>

          {movie.recommendations.results.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 className="section-title">Recommendations</h2>
              <div className="grid">
                {movie.recommendations.results.slice(0, 6).map(m => (
                  <MediaCard
                    key={m.id} id={m.id} title={m.title} poster={m.poster_path}
                    year={m.release_date} rating={m.vote_average} mediaType="movie"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
