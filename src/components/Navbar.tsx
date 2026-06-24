import { Link, useRouter } from "@tanstack/react-router";
import { ShoppingCart, Zap, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { CartSheet } from "@/components/CartSheet";
import { useState, useEffect } from "react";

export function Navbar() {
  const { items } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Cargar preferencia guardada, si no hay, usar modo oscuro por defecto
    const saved = localStorage.getItem("theme");
    const isDarkMode = saved ? saved === "dark" : true; // Por defecto: oscuro
    setIsDark(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    if (newIsDark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-grad glow-soft group-hover:glow transition-all">
            <Zap className="h-5 w-5 text-neon-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Inno<span className="text-gradient">vatech</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <Link to="/courses" className="hover:text-foreground transition-colors">Cursos</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">Sobre nosotros</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contacto</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="btn-glow"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative btn-glow"
            onClick={() => setOpen(true)}
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-cyan-grad text-neon-foreground border-0">
                {items.length}
              </Badge>
            )}
          </Button>

          {user ? (
            <>
              <Button asChild variant="outline" size="sm" className="btn-glow border-primary/40">
                <Link to="/dashboard"><LayoutDashboard className="h-4 w-4 mr-1.5" />Mi panel</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
              <Link to="/auth">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
      <CartSheet open={open} onOpenChange={setOpen} />
    </header>
  );
}
