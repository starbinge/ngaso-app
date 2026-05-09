import { Link } from 'react-router-dom';
import { getImg } from '../api/tmdb';

interface Props {
  id: number;
  title: string;
  poster: string | null;
  year: string;
  rating: number;
  mediaType: 'movie' | 'tv';
}

export default function MediaCard({ id, title, poster, year, rating, mediaType }: Props) {
  return (
    <Link to={`/${mediaType}/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 8, overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        <div style={{ aspectRatio: '2/3', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
          {poster ? (
            <img src={getImg(poster, 'w342')} alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No Image
            </div>
          )}
        </div>
        <div style={{ padding: '10px 12px 12px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
            {title}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{year?.split('-')[0] || '—'}</span>
            <span style={{ color: rating > 7 ? '#46d369' : 'var(--text-muted)' }}>
              ★ {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
