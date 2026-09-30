export function getSession() {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!user?.token) return null;
    const part = user.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part));
    return payload.exp * 1000 > Date.now() ? user : null;
  } catch {
    return null;
  }
}
export function clearSession() {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartCount");
  window.dispatchEvent(new Event("session-change"));
  window.dispatchEvent(new CustomEvent("cart-change", { detail: 0 }));
}
export function saveSession(user) {
  localStorage.setItem("userInfo", JSON.stringify(user));
  localStorage.removeItem("cartCount");
  window.dispatchEvent(new Event("session-change"));
}
