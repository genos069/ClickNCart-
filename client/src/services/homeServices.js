import API from "./api.js";

export const getAllProducts = async () => {
  const res = await API.get("/product/all");
  return res.data.data;
};