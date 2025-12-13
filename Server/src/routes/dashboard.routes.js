import express from "express";
import { getMyUploads, revokeLink } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-uploads", authMiddleware, getMyUploads);
router.post("/revoke/:id", authMiddleware, revokeLink);

export default router;
