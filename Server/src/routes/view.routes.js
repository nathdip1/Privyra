import express from "express";
import { viewImage } from "../controllers/view.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
  Secure View Route
  - Requires login
  - Enables per-user view tracking
*/
router.get("/:token", authMiddleware, viewImage);

export default router;
