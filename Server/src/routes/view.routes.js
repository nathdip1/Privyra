import express from "express";
import { viewImage } from "../controllers/view.controller.js";

const router = express.Router();

router.get("/:link", viewImage);

export default router;
