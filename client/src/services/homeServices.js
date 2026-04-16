import API from "./api.js";

export const getAllProducts = async () => {
  const res = await API.get("/product/all");
  console.log(res.data)
  return res.data.data;
};