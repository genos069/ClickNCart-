import API from "./api";

export const getCart = (token) =>
  API.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = (data, token) =>
  API.post("/cart", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeFromCart = (id, token) =>
  API.delete(`/cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const clearCart = (token) =>
  API.delete("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const applyPromo = (code, token) =>
  API.post(
    "/cart/promo",
    { code },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const updateCart = (productId, quantity, token) =>
  API.patch(
    "/cart/update",
    { productId, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const updateShippingMethod = (method, token) =>
  API.put(
    "/cart/shipping",
    { method },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
;

export const saveAddress = (address, token) =>
  API.put("/cart/address", address, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
;

