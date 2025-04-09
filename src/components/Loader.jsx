
import { cn } from "@/lib/utils";

export function Loader({ className, size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader size="lg" />
      <p className="mt-4 text-foreground/80 animate-pulse">Chargement...</p>
    </div>
  );
}

export function CardPlaceholder() {
  return (
    <div className="movie-card animate-pulse-opacity bg-muted">
      <div className="aspect-[2/3] w-full bg-muted-foreground/20"></div>
      <div className="p-3">
        <div className="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
        <div className="mt-2 h-3 w-1/2 bg-muted-foreground/20 rounded"></div>
      </div>
    </div>
  );
}
