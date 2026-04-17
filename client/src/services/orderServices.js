import API from "./api";

export const placeOrder = async (token) => API.post(
    "/api/orders",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
;