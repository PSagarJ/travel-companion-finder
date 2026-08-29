import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Menu, LogOut, User, LayoutDashboard, PlusCircle, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground";

const Navbar = () => {
  const navigate = useNavigate();
  useLocation(); // Subscribing here re-renders this component on every route change

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Derived directly from localStorage on every render (no effect needed) —
  // this component already re-renders on route change via useLocation above,
  // and handleLogout triggers a navigate() which re-renders it too.
  const loggedInUser = localStorage.getItem("user");
  const user = loggedInUser ? JSON.parse(loggedInUser) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/login");
  };

  const loggedInLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/create-trip", label: "Post a Trip", icon: PlusCircle },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-primary">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <Plane className="size-4.5 -rotate-45" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            TravelBuddy
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-7 md:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          <Link to="/feed" className={cn(navLinkClass, "flex items-center gap-1.5")}>
            <Images className="size-4" /> Feed
          </Link>

          {user ? (
            <>
              {loggedInLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className={cn(navLinkClass, "flex items-center gap-1.5")}>
                  <Icon className="size-4" /> {label}
                </Link>
              ))}

              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-primary">
                <User className="size-3.5" /> {user.name}
              </Badge>

              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="size-3.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                Log In
              </Link>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <Plane className="size-4.5 -rotate-45" /> TravelBuddy
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-6">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Home
                </Link>
                <Link
                  to="/feed"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Feed
                </Link>

                {user ? (
                  <>
                    {loggedInLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-secondary"
                      >
                        {label}
                      </Link>
                    ))}

                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-secondary px-3 py-3 text-sm font-semibold text-primary">
                      <User className="size-4" /> {user.name}
                    </div>

                    <Button
                      variant="destructive"
                      className="mt-3 w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-secondary"
                    >
                      Log In
                    </Link>
                    <Button asChild className="mt-3 w-full">
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
