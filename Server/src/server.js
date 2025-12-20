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
   ✅ ENV-BASED CORS (DEV + PROD)
   - SAME rules for POST + OPTIONS
   - Allows crypto headers
   - Works for browser, mobile, Postman
=============================== */
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server, mobile apps, curl, postman
    if (!origin) return callback(null, true);

    // exact matches (localhost, prod domain)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow all Vercel preview deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-IV", "X-Mime-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


/* ===============================
   BODY PARSER
=============================== */
app.use(express.json());

/* ===============================
   ROUTES
=============================== */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/view", viewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ===============================
   DB
=============================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log("MongoDB connected");
    initGridFS(conn.connection);
  })
  .catch((err) => console.error("Mongo error:", err));

/* ===============================
   START
=============================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
