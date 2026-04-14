import API from "./api.js";


export const searchProducts = async (params = {}) => {
  const res = await API.get("/product/list", {
    params: { ...params },
  });

  return res.data;
};

