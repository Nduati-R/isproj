import { useEffect, useState } from "react";
import { Sprout, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">CropAdvisor</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="/#about" className="text-foreground hover:text-primary transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          {user ? (
            <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button variant="heroPrimary" size="lg" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:hidden">
              <nav className="flex flex-col gap-4 mt-8">
                <a 
                  href="/#features" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="/#how-it-works" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="/#about" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <div className="border-t border-border my-4"></div>
                {user ? (
                  <>
                    <Button 
                      variant="default" 
                      className="w-full" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/dashboard");
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/auth");
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/auth");
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
