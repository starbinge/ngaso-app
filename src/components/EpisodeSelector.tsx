import { useState, useEffect, startTransition } from 'react';
import { tmdb, getImg } from '../api/tmdb';
import type { Season, Episode } from '../types/tmdb';

interface Props {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onSelect: (season: number, episode: number) => void;
}

export default function EpisodeSelector({ tvId, seasons, currentSeason, currentEpisode, onSelect }: Props) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startTransition(() => setSelectedSeason(currentSeason));
  }, [currentSeason]);

  useEffect(() => {
    const seasonData = seasons.find(s => s.season_number === selectedSeason);
    if (!seasonData) return;
    startTransition(() => setLoading(true));
    tmdb.tvSeason(tvId, selectedSeason)
      .then(data => setEpisodes(data.episodes))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tvId, selectedSeason, seasons]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Season:</label>
        <select
          value={selectedSeason}
          onChange={e => { setSelectedSeason(Number(e.target.value)); setEpisodes([]); }}
          className="select-minimal">
          {seasons.filter(s => s.season_number > 0).map(s => (
            <option key={s.id} value={s.season_number}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading && <div className="spinner" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {episodes.map(ep => (
          <button
            key={ep.id}
            onClick={() => onSelect(selectedSeason, ep.episode_number)}
            style={{
              display: 'flex', gap: 12, padding: 10, borderRadius: 8, border: 'none',
              background: currentSeason === selectedSeason && currentEpisode === ep.episode_number
                ? 'rgba(229,9,20,0.2)' : 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)',
              transition: 'background 0.2s', alignItems: 'center',
              outline: currentSeason === selectedSeason && currentEpisode === ep.episode_number
                ? '1px solid var(--accent)' : 'none',
            }}
            onMouseEnter={e => { if (!(currentSeason === selectedSeason && currentEpisode === ep.episode_number)) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={e => { if (!(currentSeason === selectedSeason && currentEpisode === ep.episode_number)) e.currentTarget.style.background = 'var(--bg-card)'; }}>
            <div style={{ width: 120, minWidth: 120, aspectRatio: '16/9', borderRadius: 4, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
              {ep.still_path ? (
                <img src={getImg(ep.still_path, 'w300')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  No Image
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>
                {ep.episode_number}. {ep.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ep.overview || 'No overview available.'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
