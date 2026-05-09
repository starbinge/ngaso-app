import { useEffect, useRef } from 'react';

interface Props {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  color?: string;
  autoPlay?: boolean;
}

export default function VidkingPlayer({ mediaType, tmdbId, season, episode, color = 'e50914', autoPlay = true }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  let src: string;
  if (mediaType === 'movie') {
    src = `https://www.vidking.net/embed/movie/${tmdbId}?color=${color}&autoPlay=${autoPlay}`;
  } else {
    src = `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?color=${color}&autoPlay=${autoPlay}&nextEpisode=true&episodeSelector=true`;
  }

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'PLAYER_EVENT') {
            console.log('[Vidking]', parsed.data);
          }
        } catch {
          // ignore non-json messages
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', paddingTop: '56.25%',
      background: '#000', borderRadius: 8, overflow: 'hidden',
    }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
