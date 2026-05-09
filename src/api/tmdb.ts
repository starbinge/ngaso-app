import type { Movie, TVShow, MovieDetail, TVShowDetail, PaginatedResponse, Season, Episode, Genre } from '../types/tmdb';
import { countries } from './countries';

const BASE_URL = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const tmdb = {
  trending: (media: 'movie' | 'tv' | 'all' = 'all', time: 'day' | 'week' = 'week') =>
    fetchJson<PaginatedResponse<Movie>>(`${BASE_URL}/trending/${media}/${time}?language=en-US`),

  searchMulti: (query: string) =>
    fetchJson<PaginatedResponse<Movie | TVShow>>(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1`),

  movieDetail: (id: number) =>
    fetchJson<MovieDetail>(`${BASE_URL}/movie/${id}?language=en-US&append_to_response=credits,videos,recommendations`),

  tvDetail: (id: number) =>
    fetchJson<TVShowDetail>(`${BASE_URL}/tv/${id}?language=en-US&append_to_response=credits,videos,recommendations`),

  tvSeason: (id: number, season: number) =>
    fetchJson<Season & { episodes: Episode[] }>(`${BASE_URL}/tv/${id}/season/${season}?language=en-US`),

  popularMovies: () =>
    fetchJson<PaginatedResponse<Movie>>(`${BASE_URL}/movie/popular?language=en-US&page=1`),

  popularTV: () =>
    fetchJson<PaginatedResponse<TVShow>>(`${BASE_URL}/tv/popular?language=en-US&page=1`),

  genresMovie: () =>
    fetchJson<{ genres: Genre[] }>(`${BASE_URL}/genre/movie/list?language=en-US`),

  genresTV: () =>
    fetchJson<{ genres: Genre[] }>(`${BASE_URL}/genre/tv/list?language=en-US`),

  discoverMovie: (genreId?: number, country?: string) => {
    const params = new URLSearchParams({ language: 'en-US', sort_by: 'popularity.desc', page: '1' });
    if (genreId) params.set('with_genres', String(genreId));
    if (country) {
      const c = countries.find(c => c.code === country);
      if (c) params.set('with_original_language', c.language);
    }
    return fetchJson<PaginatedResponse<Movie>>(`${BASE_URL}/discover/movie?${params}`);
  },

  discoverTV: (genreId?: number, country?: string) => {
    const params = new URLSearchParams({ language: 'en-US', sort_by: 'popularity.desc', page: '1' });
    if (genreId) params.set('with_genres', String(genreId));
    if (country) params.set('with_origin_country', country);
    return fetchJson<PaginatedResponse<TVShow>>(`${BASE_URL}/discover/tv?${params}`);
  },

  topMoviesByCountry: (country: string, page = 1) => {
    const c = countries.find(c => c.code === country);
    if (!c) return fetchJson<PaginatedResponse<Movie>>(`${BASE_URL}/movie/top_rated?language=en-US&page=${page}`);
    const params = new URLSearchParams({
      language: 'en-US',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200',
      with_original_language: c.language,
      page: String(page),
    });
    return fetchJson<PaginatedResponse<Movie>>(`${BASE_URL}/discover/movie?${params}`);
  },

  topTVByCountry: (country: string, page = 1) => {
    const params = new URLSearchParams({
      language: 'en-US',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '50',
      with_origin_country: country,
      page: String(page),
    });
    return fetchJson<PaginatedResponse<TVShow>>(`${BASE_URL}/discover/tv?${params}`);
  },
};

export const IMG_BASE = 'https://image.tmdb.org/t/p';
export const getImg = (path: string | null, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : '';
