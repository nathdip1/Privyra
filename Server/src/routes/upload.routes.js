import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
  ✅ IMPORTANT
  Explicit memory storage is REQUIRED for:
  - mobile browsers
  - binary Blob uploads
  - encrypted payloads
*/
const upload = multer({
  storage: multer.memoryStorage(), // 🔴 CRITICAL FIX
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "encryptedFile", maxCount: 1 },
    { name: "iv", maxCount: 1 },
  ]),
  uploadImage
);

export default router;
