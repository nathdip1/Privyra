import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import viewRoutes from "./routes/view.routes.js";
import imageRoutes from "./routes/image.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"; // ✅ ADD THIS

dotenv.config();
console.log("JWT SECRET LOADED:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
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
app.use("/api/dashboard", dashboardRoutes); // ✅ ADD THIS

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.log("MongoDB connection error:", err)
  );

// Start server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
