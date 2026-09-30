import API from "./api";
export const placeOrder = (cart, key) =>
  API.post(
    "/orders",
    { cartVersion: cart.version, expectedTotal: cart.total },
    { headers: { "Idempotency-Key": key } },
  );
