import API from "./api.js";

export const searchProducts = async (params = {}) => {
  const res = await API.get("/product/list", {
    params: { ...params },
  });

  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/product/${id}`);
  return res.data;
};

export const getProductByIds = async (id) => {
  const res = await API.get(`/product/all/${id}`);
  return res.data;
};

export const getRelatedProducts = async (id) => {
  const res = await API.get(`/product/related/${id}`);
  return res.data;
};

export const fetchProducts = async () => {
  const res = await API.get("/product/all")
  return res.data
};
