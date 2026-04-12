import API from "./api.js";

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// REGISTER
export const registerUser = (data) => API.post("/auth/register", data);

// FORGOT PASSWORD
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

// RESET PASSWORD
export const resetPassword = (token, data) => API.put(`/auth/reset-password/${token}`, data);