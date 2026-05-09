export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const tmdbPath = params.tmdb_path || '';

  const rest = {};
  for (const [key, val] of Object.entries(params)) {
    if (key !== 'tmdb_path' && val) rest[key] = val;
  }
  const qs = new URLSearchParams(rest).toString();
  const url = `https://api.themoviedb.org/3/${tmdbPath}${qs ? `?${qs}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error' }),
    };
  }
};
