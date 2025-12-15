import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
  Multer is kept ONLY to parse form fields.
  Encrypted data is NOT treated as a file.
*/
const upload = multer();

// ✅ auth → multer (no files) → controller
router.post("/", authMiddleware, upload.none(), uploadImage);

export default router;
