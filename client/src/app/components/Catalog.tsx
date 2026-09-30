import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import API from "../../services/api";
import { searchProducts, getProductById } from "../../services/productServices";
import { addToCart } from "../../services/cartServices";
import { getSession } from "../../services/session";
import { getFavorites, toggleFavorite } from "../../services/favorites";
export function Catalog({
  mode = "shop",
}: {
  mode?: "shop" | "sale" | "favorites";
}) {
  const location = useLocation(),
    navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]),
    [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState("");
  const [page, setPage] = useState(1),
    [pages, setPages] = useState(0),
    [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    inStock: false,
    sortBy: "featured",
  });
  const change = (key: string, value: string | boolean) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };
  useEffect(() => {
    API.get("/product/filters")
      .then((r) => setCategories(r.data.categories))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const sync = () => setFavorites(getFavorites());
    window.addEventListener("favorites-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    setPage(1);
  }, [location.search, mode]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        if (mode === "favorites") {
          const results = await Promise.all(
            favorites.slice((page - 1) * 24, page * 24).map(async (id) => {
              try {
                return (await getProductById(id)).data;
              } catch (e: any) {
                if (e.response?.status === 404) return null;
                throw e;
              }
            }),
          );
          if (active) {
            setProducts(results.filter(Boolean));
            setTotal(favorites.length);
            setPages(Math.ceil(favorites.length / 24));
          }
        } else {
          const params = new URLSearchParams(location.search);
          const result = await searchProducts({
            search: params.get("search") || undefined,
            brand: params.get("brand") || undefined,
            category: filters.category || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            minRating: filters.minRating || undefined,
            inStock: filters.inStock ? "true" : undefined,
            sortBy: filters.sortBy,
            sale: mode === "sale" ? "true" : undefined,
            page,
            limit: 24,
          });
          if (active) {
            setProducts(result.data);
            setTotal(result.total);
            setPages(result.pages);
          }
        }
      } catch (e: any) {
        if (active)
          setError(
            e.response?.data?.message ||
              "Could not load products. Please retry.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [location.search, filters, page, mode, favorites]);
  const add = async (product: any) => {
    const user = getSession();
    if (!user) {
      navigate("/login");
      return;
    }
    setBusy(product._id);
    setError("");
    try {
      await addToCart({ productId: product._id, quantity: 1 }, user.token);
    } catch (e: any) {
      setError(e.response?.data?.message || "Could not add product");
    } finally {
      setBusy("");
    }
  };
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">
        {mode === "sale"
          ? "Current Offers"
          : mode === "favorites"
            ? "Your Favorites"
            : "Shop All Products"}
      </h1>
      <p className="text-gray-600 mb-6">
        {mode === "favorites"
          ? "Saved on this browser, separately for each account."
          : `${total} products in our catalog`}
      </p>
      {mode !== "favorites" && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          <label>
            Category
            <select
              aria-label="Category"
              value={filters.category}
              onChange={(e) => change("category", e.target.value)}
              className="block w-full border rounded p-2"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Minimum price
            <input
              aria-label="Minimum price"
              type="number"
              min="0"
              className="block border rounded p-2 w-full"
              value={filters.minPrice}
              onChange={(e) => change("minPrice", e.target.value)}
            />
          </label>
          <label>
            Maximum price
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              placeholder="No limit"
              className="block border rounded p-2 w-full"
              value={filters.maxPrice}
              onChange={(e) => change("maxPrice", e.target.value)}
            />
          </label>
          <label>
            Rating
            <select
              aria-label="Minimum rating"
              value={filters.minRating}
              onChange={(e) => change("minRating", e.target.value)}
              className="block border rounded p-2 w-full"
            >
              <option value="">Any rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+ stars
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select
              aria-label="Sort products"
              value={filters.sortBy}
              onChange={(e) => change("sortBy", e.target.value)}
              className="block border rounded p-2 w-full"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => change("inStock", e.target.checked)}
            />
            In stock only
          </label>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                category: "",
                minPrice: "",
                maxPrice: "",
                minRating: "",
                inStock: false,
                sortBy: "featured",
              });
              setPage(1);
              navigate(mode === "sale" ? "/sale" : "/shop");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="p-4 bg-red-50 text-red-700 mb-4">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading products…</p>
      ) : (
        <>
          {!products.length && (
            <p className="py-12">
              No products found. Try clearing filters or visit the{" "}
              <Link className="text-blue-600 underline" to="/shop">
                shop
              </Link>
              .
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Card key={p._id} className="overflow-hidden border-blue-100">
                <Link to={`/product/${p._id}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-52 w-full object-contain bg-white"
                  />
                </Link>
                <div className="p-4 space-y-3">
                  <Link
                    to={`/product/${p._id}`}
                    className="font-semibold block"
                  >
                    {p.name}
                  </Link>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="flex gap-2">
                    <Star className="w-4 text-amber-500" />
                    {p.rating || 0} ({p.reviews || 0} reviews)
                  </p>
                  <p className="text-xl font-bold">
                    ${p.price.toFixed(2)}{" "}
                    {p.originalPrice > p.price && (
                      <del className="text-sm font-normal text-gray-500">
                        ${p.originalPrice.toFixed(2)}
                      </del>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      disabled={!p.inStock || !!busy}
                      onClick={() => add(p)}
                      className="flex-1 bg-blue-600"
                    >
                      <ShoppingCart className="w-4 mr-2" />
                      {busy === p._id
                        ? "Adding…"
                        : p.inStock
                          ? "Add to Cart"
                          : "Out of stock"}
                    </Button>
                    <Button
                      variant="outline"
                      aria-label={
                        favorites.includes(p._id)
                          ? "Remove favorite"
                          : "Save favorite"
                      }
                      aria-pressed={favorites.includes(p._id)}
                      onClick={() => toggleFavorite(p._id)}
                    >
                      <Heart
                        className={
                          favorites.includes(p._id)
                            ? "fill-pink-500 text-pink-500 w-4"
                            : "w-4"
                        }
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {pages > 1 && (
            <nav
              aria-label="Product pages"
              className="flex justify-center items-center gap-4 mt-8"
            >
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span>
                Page {page} of {pages}
              </span>
              <Button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
