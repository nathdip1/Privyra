import express from "express";
import { getImageAuditLog } from "../controllers/image.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
  GET /api/images/:id/audit
  - Only uploader
*/
router.get("/:id/audit", authMiddleware, getImageAuditLog);

export default router;
