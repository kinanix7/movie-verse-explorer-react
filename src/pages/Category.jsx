
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import { MovieCard } from "@/components/MovieCard";
import { FullPageLoader, CardPlaceholder } from "@/components/Loader";
import { Button } from "@/components/ui/button";

const categoryTitles = {
  popular: "Films populaires",
  "top-rated": "Films les mieux notés",
  upcoming: "Prochaines sorties",
  trending: "Films en tendance",
};

export default function Category() {
  const { type } = useParams();
  const categoryType = type;
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const genresData = await api.getGenres();
        const genresMap = {};
        genresData.genres.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchMoviesByCategory() {
      setIsLoading(true);
      setPage(1);
      setMovies([]);
      
      try {
        let data;
        switch (categoryType) {
          case "popular":
            data = await api.getPopularMovies();
            break;
          case "top-rated":
            data = await api.getTopRatedMovies();
            break;
          case "upcoming":
            data = await api.getUpcomingMovies();
            break;
          case "trending":
            data = await api.getTrendingMovies();
            break;
          default:
            data = await api.getPopularMovies();
        }
        
        setMovies(data.results);
        setHasMore(data.page < data.total_pages);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching ${categoryType} movies:`, error);
        setIsLoading(false);
      }
    }

    fetchMoviesByCategory();
  }, [categoryType]);

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      let data;
      switch (categoryType) {
        case "popular":
          data = await api.getPopularMovies(nextPage);
          break;
        case "top-rated":
          data = await api.getTopRatedMovies(nextPage);
          break;
        case "upcoming":
          data = await api.getUpcomingMovies(nextPage);
          break;
        case "trending":
          data = await api.getTrendingMovies();
          break;
        default:
          data = await api.getPopularMovies(nextPage);
      }
      
      setMovies(prev => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error(`Error fetching more ${categoryType} movies:`, error);
    }
  };

  const title = categoryTitles[categoryType] || "Films";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <CardPlaceholder key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} variant="outline" size="lg">
            Charger plus
          </Button>
        </div>
      )}
    </div>
  );
}
