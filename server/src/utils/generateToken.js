import jwt from "jsonwebtoken";
export default (user) =>
  jwt.sign(
    { id: user._id, version: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { expiresIn: "1d", algorithm: "HS256" },
  );
