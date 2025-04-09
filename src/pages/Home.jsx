
import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/services/api";
import { MovieCard } from "@/components/MovieCard";
import { FullPageLoader, CardPlaceholder } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [trendingData, popularData, topRatedData, upcomingData, genresData] = await Promise.all([
          api.getTrendingMovies(),
          api.getPopularMovies(),
          api.getTopRatedMovies(),
          api.getUpcomingMovies(),
          api.getGenres(),
        ]);

        setTrendingMovies(trendingData.results.slice(0, 10));
        setPopularMovies(popularData.results.slice(0, 10));
        setTopRatedMovies(topRatedData.results.slice(0, 10));
        setUpcomingMovies(upcomingData.results.slice(0, 10));
        
        const genresMap = {};
        genresData.genres.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  const renderSection = (title, movies, path) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link to={path}>
          <Button variant="ghost" className="group">
            Voir plus
            <ChevronRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Bienvenue sur MovieVerse</h1>
        <p className="text-lg mb-4">
          Explorez les derniers films, les mieux notés et les prochaines sorties.
        </p>
      </section>

      {renderSection("Tendances", trendingMovies, "/category/trending")}
      {renderSection("Films populaires", popularMovies, "/category/popular")}
      {renderSection("Mieux notés", topRatedMovies, "/category/top-rated")}
      {renderSection("Prochaines sorties", upcomingMovies, "/category/upcoming")}
    </div>
  );
}
