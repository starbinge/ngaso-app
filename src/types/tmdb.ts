export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  credits: Credits;
  videos: Videos;
  recommendations: { results: Movie[] };
}

export interface TVShowDetail extends TVShow {
  genres: Genre[];
  seasons: Season[];
  number_of_seasons: number;
  tagline: string;
  credits: Credits;
  videos: Videos;
  recommendations: { results: TVShow[] };
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Videos {
  results: Video[];
}

export interface PaginatedResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface VidkingEvent {
  type: string;
  data: {
    event: string;
    currentTime: number;
    duration: number;
    progress: number;
    id: string;
    mediaType: string;
    season?: number;
    episode?: number;
  };
}
