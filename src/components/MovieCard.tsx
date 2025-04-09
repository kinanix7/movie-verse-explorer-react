
import { Movie, getImageUrl } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  genres?: { [id: number]: string };
}

export function MovieCard({ movie, genres }: MovieCardProps) {
  return (
    <Card className="movie-card overflow-hidden h-full flex flex-col animate-fade-in">
      <Link to={`/movie/${movie.id}`} className="relative group block flex-1">
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium px-3 py-1.5 bg-black/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Voir détails
          </span>
        </div>
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="movie-poster aspect-[2/3] object-cover w-full"
          loading="lazy"
        />
      </Link>
      <CardContent className="p-3">
        <Link to={`/movie/${movie.id}`} className="block">
          <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center text-sm gap-1 text-muted-foreground">
            {movie.release_date && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
            <span className="text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
        {genres && movie.genre_ids && movie.genre_ids.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genre_ids.slice(0, 2).map((genreId) => (
              <Badge key={genreId} variant="outline" className="text-xs">
                {genres[genreId]}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
