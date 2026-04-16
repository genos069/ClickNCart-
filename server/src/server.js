import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import brandRoute from "./routes/brandRoute.js";

dotenv.config({quiet: true});
const app = express();

app.use((req, res, next) => {
  console.log("🌍 GLOBAL HIT:", req.method, req.url);
  next();
});

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes)
app.use("/api/review", reviewRoutes)
app.use("/api/brand", brandRoute)

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});