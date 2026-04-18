import API from "./api";

export const fetchBrands = async () => {
  const res = await API.get("/brand");
  return res.data;
};
