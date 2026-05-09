import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(
  req: IncomingMessage & { query: Record<string, string | string[]> },
  res: ServerResponse
) {
  const segments = req.query.catchall;
  const path = Array.isArray(segments) ? segments.join('/') : '';
  if (!path) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing path' }));
    return;
  }

  const idx = req.url!.indexOf('?');
  const search = idx >= 0 ? req.url!.slice(idx) : '';
  const target = `https://api.themoviedb.org/3/${path}${search}`;

  try {
    const response = await fetch(target, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    const data = await response.json();
    res.writeHead(response.status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error' }));
  }
}
