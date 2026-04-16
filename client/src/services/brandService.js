import API from "./api";

export const fetchBrands = async () => {
  const res = await API.get("/brand");
  console.log(res.data.data[34])
  return res.data;
};
