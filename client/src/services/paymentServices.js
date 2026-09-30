import API from "./api";

export const savePaymentMethod = (paymentMethod, token) =>
  API.post(
    "/payment",
    { paymentMethod },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
