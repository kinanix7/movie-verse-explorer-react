
const API_KEY = "60ed65ad00f99e8898315297aece95e5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const api = {
  // Trending movies
  getTrendingMovies: async (timeWindow = "week") => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Popular movies
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Top rated movies
  getTopRatedMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Upcoming movies
  getUpcomingMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    return response.json();
  },
  
  // Movie details
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Search movies
  searchMovies: async (query, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`
    );
    return response.json();
  },
  
  // Get movie genres
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`
    );
    return response.json();
  },
  
  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return response.json();
  },
};
