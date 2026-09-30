import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import brandRoute from "./routes/brandRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
export const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY)
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  req.body ??= {};
  next();
});
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 900000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
  authRoutes,
);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/brand", brandRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/health", (req, res) =>
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .json({ ready: mongoose.connection.readyState === 1 }),
);
app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  const status =
    err.status ||
    (err.code === 11000 || err.name === "VersionError"
      ? 409
      : ["ValidationError", "CastError", "SyntaxError"].includes(err.name)
        ? 400
        : 500);
  if (status >= 500) console.error("Request failed:", err.name);
  res
    .status(status)
    .json({
      message:
        status >= 500
          ? "Server error"
          : err.code === 11000
            ? "This record already exists"
            : err.name === "VersionError"
              ? "Cart changed; refresh and retry"
              : err.message,
    });
});
