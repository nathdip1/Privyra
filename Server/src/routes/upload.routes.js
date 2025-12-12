import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// FIXED ORDER: auth → multer → controller
router.post("/", authMiddleware, upload.single("image"), uploadImage);

export default router;
