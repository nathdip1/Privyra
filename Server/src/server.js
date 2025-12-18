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

/* ===============================
   CORS — FINAL & CORRECT
=============================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.19:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://192.168.1.19:3000",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],

    // 🔴 REQUIRED FOR VIEW
    exposedHeaders: ["X-IV", "X-Mime-Type"],

    credentials: false,
    optionsSuccessStatus: 200,
  })
);


/* ===============================
   BODY PARSERS
=============================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
=============================== */

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/view", viewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ===============================
   DATABASE
=============================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log("MongoDB connected");
    initGridFS(conn.connection);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/* ===============================
   START SERVER
=============================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
