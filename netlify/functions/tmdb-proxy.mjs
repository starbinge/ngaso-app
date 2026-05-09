export const handler = async (event) => {
  const params = event.queryStringParameters || {};

  let tmdbPath = params.tmdb_path || '';
  tmdbPath = tmdbPath.startsWith('/') ? tmdbPath.slice(1) : tmdbPath;

  const rest = { ...params };
  delete rest.tmdb_path;

  const qs = new URLSearchParams(rest).toString();
  const finalUrl = `https://api.themoviedb.org/3/${tmdbPath}${qs ? `?${qs}` : ''}`;

  console.log('TMDB proxy URL:', finalUrl);

  try {
    const response = await fetch(finalUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: err.message }),
    };
  }
};
