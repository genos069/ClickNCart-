import API from "./api";

export const placeOrder = async (token) => API.post(
    "/orders",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
;