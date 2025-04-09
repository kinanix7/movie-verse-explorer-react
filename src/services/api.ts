
const API_KEY = "60ed65ad00f99e8898315297aece95e5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  vote_count: number;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const api = {
  // Trending movies
  getTrendingMovies: async (timeWindow: "day" | "week" = "week"): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Popular movies
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Movie details
  getMovieDetails: async (movieId: string): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`
    );
    return response.json();
  },
  
  // Get movie genres
  getGenres: async (): Promise<GenresResponse> => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return response.json();
  },
};
