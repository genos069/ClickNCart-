import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import API from "../../services/api";
import { getSession } from "../../services/session";
export function Layout() {
  const location = useLocation(),
    navigate = useNavigate(),
    menuButton = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState(""),
    [open, setOpen] = useState(false),
    [count, setCount] = useState(0);
  const links = [
    ["/", "Home"],
    ["/shop", "Shop"],
    ["/brands", "Brands"],
    ["/sale", "Sale"],
  ];
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const sync = (e: Event) => setCount((e as CustomEvent).detail || 0);
    const load = () => {
      setCount(0);
      if (getSession()) API.get("/cart").catch(() => {});
    };
    load();
    window.addEventListener("cart-change", sync);
    window.addEventListener("session-change", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("cart-change", sync);
      window.removeEventListener("session-change", load);
      window.removeEventListener("storage", load);
    };
  }, []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setOpen(false);
  };
  const searchForm = (
    <form onSubmit={submit} className="flex gap-2 w-full">
      <input
        aria-label="Search products"
        maxLength={100}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products…"
        className="border border-blue-200 rounded-lg px-3 py-2 w-full min-w-0"
      />
      <Button type="submit" aria-label="Search">
        <Search className="w-4" />
      </Button>
    </form>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 bg-white/95 border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link
              to="/"
              className="text-xl font-semibold text-blue-700 flex gap-2 items-center"
            >
              <ShoppingCart className="w-6" />
              ClickNCart
            </Link>
            <div className="hidden md:block flex-1 max-w-xl">{searchForm}</div>
            <div className="flex items-center gap-3">
              <Link
                to="/favorites"
                aria-label="Favorites"
                className="hidden md:block"
              >
                <Heart className="w-5" />
              </Link>
              <Link
                to={getSession() ? "/profile" : "/login"}
                aria-label="Account"
                className="hidden md:block"
              >
                <User className="w-5" />
              </Link>
              <Link
                to="/cart"
                aria-label={`Cart, ${count} items`}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="w-5" />
                <span>{count}</span>
              </Link>
              <Button
                ref={menuButton}
                className="md:hidden"
                variant="ghost"
                aria-label="Toggle navigation"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((v) => !v)}
              >
                <Menu />
              </Button>
            </div>
          </div>
          <nav
            aria-label="Main navigation"
            className="hidden md:flex gap-8 py-3 border-t"
          >
            {links.map(([to, title]) => (
              <Link
                key={to}
                to={to}
                aria-current={location.pathname === to ? "page" : undefined}
                className="hover:text-blue-600"
              >
                {title}
              </Link>
            ))}
          </nav>
          {open && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="md:hidden py-4 space-y-4"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  menuButton.current?.focus();
                }
              }}
            >
              {searchForm}
              <div className="flex flex-wrap gap-5">
                {[
                  ...links,
                  ["/favorites", "Favorites"],
                  [getSession() ? "/profile" : "/login", "Account"],
                ].map(([to, title]) => (
                  <Link key={to} to={to}>
                    {title}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="mt-20 bg-gradient-to-br from-slate-900 to-blue-900 text-blue-100">
        <div className="container mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
          <div>
            <h2 className="font-semibold text-white mb-2">ClickNCart</h2>
            <p>Tech and lifestyle products.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-col gap-2">
            {links.slice(1).map(([to, title]) => (
              <Link key={to} to={to}>
                {title}
              </Link>
            ))}
          </nav>
          <div>
            <h2 className="font-semibold text-white mb-2">
              Shopping information
            </h2>
            <p>
              Cash on delivery. Shipping costs and delivery estimates are shown
              at checkout.
            </p>
            {import.meta.env.VITE_SUPPORT_EMAIL && (
              <a
                className="underline"
                href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
              >
                Contact support
              </a>
            )}
          </div>
        </div>
        <p className="text-center p-4 border-t border-blue-800">
          © {new Date().getFullYear()} ClickNCart
        </p>
      </footer>
    </div>
  );
}
