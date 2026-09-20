import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  Menu,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Images,
  ArrowUpRight,
  Users,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loggedInUser = localStorage.getItem("user");
  const user = loggedInUser ? JSON.parse(loggedInUser) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/login");
  };

  const links = [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/feed",
      label: "Travel Feed",
      icon: Images,
    },
    ...(user
      ? [
          {
            to: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            to: "/matches",
            label: "Matches",
            icon: Users,
          },
          {
            to: "/profile/edit",
            label: "Travel Profile",
            icon: UserCog,
          },
        ]
      : []),
  ];

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-[100] px-3 pt-3 sm:px-6"
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5",
          scrolled
            ? "border border-white/10 bg-[#0b0e13]/80 shadow-2xl backdrop-blur-xl"
            : "border border-white/10 bg-black/10 backdrop-blur-md",
        )}
      >
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-[#ff704d] text-[#130b08] shadow-[0_8px_25px_rgba(255,112,77,0.25)]">
            <Plane className="size-[18px] -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>

          <span className="text-base font-extrabold tracking-tight text-white sm:text-lg">
            TravelBuddy
            <span className="text-[#ff704d]">.</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                location.pathname === to
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              {Icon && <Icon className="mr-1.5 inline size-3.5" />}
              {label}
            </Link>
          ))}
        </div>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to="/create-trip"
                className="mr-2 flex items-center gap-1.5 text-sm font-bold text-white/60 transition-colors hover:text-white"
              >
                <PlusCircle className="size-4" />
                Post a trip
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-xs font-bold text-white/80">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#ff704d] text-[#130b08]">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>

                {user.name}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 text-sm font-semibold text-white/65 transition-colors hover:text-white"
              >
                Log in
              </Link>

              <Button
                asChild
                size="sm"
                className="rounded-full bg-white px-5 text-black hover:bg-white/90"
              >
                <Link to="/register">
                  Get started
                  <ArrowUpRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/10"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-white/10 bg-[#0b0e13] text-white"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#ff704d] text-black">
                    <Plane className="size-4 -rotate-45" />
                  </span>
                  TravelBuddy
                  <span className="text-[#ff704d]">.</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-5 pt-3">
                {/* Mobile navigation links */}
                {links.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors",
                      location.pathname === to
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {Icon && <Icon className="mr-2 inline size-4" />}
                    {label}
                  </Link>
                ))}

                {user ? (
                  <>
                    {/* Post trip */}
                    <Link
                      to="/create-trip"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl px-4 py-3.5 text-sm font-semibold text-[#ff9a78] transition-colors hover:bg-white/5"
                    >
                      <PlusCircle className="mr-2 inline size-4" />
                      Post a trip
                    </Link>

                    {/* User */}
                    <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-sm">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#ff704d] text-black">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </span>

                      {user.name}
                    </div>

                    {/* Logout */}
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="mt-3 w-full rounded-xl"
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Log in
                    </Link>

                    <Button
                      asChild
                      className="mt-2 w-full rounded-xl bg-[#ff704d] text-black hover:bg-[#ff8061]"
                    >
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get started
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
