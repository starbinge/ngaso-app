import { useState, useEffect, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb, getImg } from '../api/tmdb';
import VidkingPlayer from '../components/VidkingPlayer';
import EpisodeSelector from '../components/EpisodeSelector';
import MediaCard from '../components/MediaCard';
import type { TVShowDetail } from '../types/tmdb';

export default function TVDetail() {
  const { id } = useParams<{ id: string }>();
  const [tv, setTV] = useState<TVShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    if (!id) return;
    startTransition(() => { setLoading(true); setShowPlayer(false); });
    tmdb.tvDetail(Number(id))
      .then(data => {
        setTV(data);
        const firstSeason = data.seasons.find(s => s.season_number > 0);
        if (firstSeason) {
          setSeason(firstSeason.season_number);
          setEpisode(1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlay = (s?: number, e?: number) => {
    if (s) setSeason(s);
    if (e) setEpisode(e);
    setShowPlayer(true);
  };

  if (loading) return <div className="page-content"><div className="spinner" /></div>;
  if (!tv) return <div className="page-content"><div className="container"><p style={{ color: 'var(--text-muted)' }}>TV show not found.</p></div></div>;

  const trailer = tv.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');

  return (
    <>
      {tv.backdrop_path && (
        <div className="backdrop" style={{ backgroundImage: `url(${getImg(tv.backdrop_path, 'original')})` }} />
      )}

      <div className="page-content">
        <div className="container">
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ width: 300, minWidth: 200, flexShrink: 0 }}>
              {tv.poster_path ? (
                <img src={getImg(tv.poster_path, 'w500')} alt={tv.name}
                  style={{ width: '100%', borderRadius: 8 }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--bg-elevated)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No Poster
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>{tv.name}</h1>
              {tv.tagline && (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12 }}>{tv.tagline}</p>
              )}

              <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16, flexWrap: 'wrap' }}>
                <span>{tv.first_air_date?.split('-')[0]}</span>
                <span style={{ color: '#46d369' }}>★ {tv.vote_average.toFixed(1)}</span>
                <span>{tv.number_of_seasons} Seasons</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {tv.genres.map(g => (
                  <span key={g.id} style={{
                    padding: '2px 10px', borderRadius: 4, fontSize: '0.8rem',
                    border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  }}>{g.name}</span>
                ))}
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{tv.overview}</p>

              <button onClick={() => handlePlay()} style={{
                padding: '12px 32px', background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 4, fontSize: '1rem', fontWeight: 700, transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
                ▶ Play S{season}:E{episode}
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
              <VidkingPlayer mediaType="tv" tmdbId={tv.id} season={season} episode={episode} />
            </div>
          )}

          <div style={{ marginBottom: 40 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Episodes</h2>
            <EpisodeSelector
              tvId={tv.id}
              seasons={tv.seasons}
              currentSeason={season}
              currentEpisode={episode}
              onSelect={(s, e) => handlePlay(s, e)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {tv.credits.cast.slice(0, 10).map(person => (
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

          {tv.recommendations.results.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 className="section-title">Recommendations</h2>
              <div className="grid">
                {tv.recommendations.results.slice(0, 6).map(t => (
                  <MediaCard
                    key={t.id} id={t.id} title={t.name} poster={t.poster_path}
                    year={t.first_air_date} rating={t.vote_average} mediaType="tv"
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
