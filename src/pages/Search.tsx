
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, Movie, Genre } from "@/services/api";
import { MovieCard } from "@/components/MovieCard";
import { FullPageLoader, CardPlaceholder } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ [id: number]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const genresData = await api.getGenres();
        const genresMap: { [id: number]: string } = {};
        genresData.genres.forEach((genre: Genre) => {
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
    async function searchMovies() {
      if (!query) {
        setMovies([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.searchMovies(query, page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error searching movies:", error);
        setIsLoading(false);
      }
    }

    searchMovies();
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setPage(1);
    }
  };

  const loadMorePages = async () => {
    if (page >= totalPages) return;
    
    try {
      const nextPage = page + 1;
      const data = await api.searchMovies(query, nextPage);
      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Recherche de films</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des films..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Rechercher</Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardPlaceholder key={index} />
          ))}
        </div>
      ) : (
        <>
          {query ? (
            <>
              <h2 className="text-xl font-medium mb-4">
                {movies.length > 0
                  ? `Résultats pour "${query}"`
                  : `Aucun résultat pour "${query}"`}
              </h2>
              {movies.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} genres={genres} />
                    ))}
                  </div>
                  {page < totalPages && (
                    <div className="flex justify-center mt-8">
                      <Button onClick={loadMorePages} variant="outline">
                        Charger plus
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">
                Recherchez des films en utilisant la barre de recherche ci-dessus
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
