
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api, getImageUrl } from "@/services/api";
import { FullPageLoader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsLoading(true);
      try {
        const data = await api.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Film non trouvé</h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "Durée inconnue";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="pb-12">
      {/* Backdrop Image */}
      <div className="relative w-full h-[30vh] md:h-[50vh] overflow-hidden mb-6">
        {movie.backdrop_path ? (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(movie.backdrop_path, "original")}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-xl backdrop-blur-card">
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date inconnue"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>

                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({movie.vote_count} votes)
                  </span>
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full mt-4 flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {movie.title}
              {movie.release_date && (
                <span className="text-muted-foreground ml-2">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              )}
            </h1>

            {movie.tagline && (
              <p className="text-lg italic text-muted-foreground mb-6">
                "{movie.tagline}"
              </p>
            )}

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-2">Synopsis</h2>
                <p className="text-muted-foreground">
                  {movie.overview || "Aucun synopsis disponible."}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">Détails</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Statut
                    </h3>
                    <p>{movie.status || "Non renseigné"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Budget
                    </h3>
                    <p>
                      {movie.budget
                        ? `${movie.budget.toLocaleString("fr-FR")} $`
                        : "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Recettes
                    </h3>
                    <p>
                      {movie.revenue
                        ? `${movie.revenue.toLocaleString("fr-FR")} $`
                        : "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Langue originale
                    </h3>
                    <p>{movie.original_language || "Non renseigné"}</p>
                  </div>
                </div>
              </section>

              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-2">
                      Production
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {movie.production_companies.map((company) => (
                        <div
                          key={company.id}
                          className="flex flex-col items-center"
                        >
                          {company.logo_path ? (
                            <img
                              src={getImageUrl(company.logo_path, "w200")}
                              alt={company.name}
                              className="h-12 object-contain mb-2"
                            />
                          ) : (
                            <div className="h-12 w-24 flex items-center justify-center bg-muted rounded mb-2">
                              <span className="text-xs text-center px-2">
                                {company.name}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {company.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
