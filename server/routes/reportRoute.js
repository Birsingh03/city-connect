import express from "express";
import { submitReport } from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/report",
  authMiddleware,
  upload.single("image"),
  submitReport
);

export default router;