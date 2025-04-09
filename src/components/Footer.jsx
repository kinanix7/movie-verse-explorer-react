
import { Film, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Film className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-xl">MovieVerse</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              Données fournies par 
              <a 
                href="https://www.themoviedb.org/"
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary/80 ml-1"
              >
                TMDb
              </a>
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              Créé avec <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" /> par MovieVerse Explorer
            </p>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MovieVerse. Tous droits réservés.
          </p>
          <p className="mt-1">
            Ce produit utilise l'API TMDb mais n'est pas approuvé ou certifié par TMDb.
          </p>
        </div>
      </div>
    </footer>
  );
}
