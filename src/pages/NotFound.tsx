import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold font-heading text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page non trouvée</p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
