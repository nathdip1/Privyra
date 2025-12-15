import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import viewRoutes from "./routes/view.routes.js";
import imageRoutes from "./routes/image.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { initGridFS } from "./utils/gridfs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// CORS (DEV SAFE)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.19:3000", // ✅ mobile dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/view", viewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("MongoDB connected");
    initGridFS(conn.connection);
  })
  .catch((err) =>
    console.log("MongoDB connection error:", err)
  );

// ===============================
// START SERVER (LAN ENABLED)
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
