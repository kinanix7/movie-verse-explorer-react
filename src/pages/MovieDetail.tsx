
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, MovieDetails, getImageUrl } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/Loader";
import { ArrowLeft, Star, Clock } from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await api.getMovieDetails(id);
        setMovie(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Impossible de charger les détails du film.");
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Erreur</h2>
        <p className="mb-6">{error || "Film non trouvé."}</p>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatMoney = (amount: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Backdrop image */}
      <div
        className="w-full h-[50vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30" />
        <div className="container mx-auto px-4 h-full relative">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>
      </div>

      {/* Movie details */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="backdrop-blur-card p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-3/4">
            <div className="flex flex-col mb-6">
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-muted-foreground italic mt-2">{movie.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {movie.release_date && (
                  <span className="text-muted-foreground">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({movie.vote_count} votes)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || "Aucun synopsis disponible."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informations</h3>
                <dl className="grid grid-cols-2 gap-2">
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd>{movie.status}</dd>
                  <dt className="text-muted-foreground">Budget</dt>
                  <dd>{formatMoney(movie.budget)}</dd>
                  <dt className="text-muted-foreground">Recettes</dt>
                  <dd>{formatMoney(movie.revenue)}</dd>
                </dl>
              </div>
              {movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Production</h3>
                  <ul className="space-y-1">
                    {movie.production_companies.map((company) => (
                      <li key={company.id}>{company.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
