import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) return res.status(401).json({ message: "Sign in required" });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res
      .status(401)
      .json({ message: "Session expired. Please sign in again" });
  }
  if (!/^[a-f\d]{24}$/i.test(decoded.id || ""))
    return res.status(401).json({ message: "Invalid session" });
  const user = await User.findById(decoded.id).select(
    "-password -resetPasswordToken -resetPasswordExpire",
  );
  if (!user || decoded.version !== (user.tokenVersion || 0))
    return res.status(401).json({ message: "Invalid session" });
  req.user = user;
  next();
};
export const admin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : res.status(403).json({ message: "Administrator access required" });
