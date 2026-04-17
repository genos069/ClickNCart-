import API from "./api";

export const submitReview = async (data, token) => {
  console.log(data, token);
  return API.post(
    `/review/create/${data.productId}`,
    {
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    },

    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const getProductReviews = (productId) => {
  return API.get(`/review/product/get/${productId}`);
};
