import { getSession } from "./session";
const key = () => `favorites:${getSession()?._id || "guest"}`;
export function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(key()) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id),
        )
      : [];
  } catch {
    return [];
  }
}
export function toggleFavorite(id) {
  const ids = getFavorites();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(key(), JSON.stringify(next));
  window.dispatchEvent(new Event("favorites-change"));
  return next;
}
