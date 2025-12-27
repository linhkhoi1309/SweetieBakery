import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import couponsRoutes from "./routes/couponsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/coupons", couponsRoutes);
app.use("/upload", uploadRoutes);
app.use("/reviews", reviewsRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("Da vao");
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
