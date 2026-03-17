import express from "express";
import { getAllComplaints, getComplaintById, getUserComplaints, updateComplaintStatus, deleteComplaint } from "../controllers/complaintController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/complaints", getAllComplaints);
router.get("/complaints/:id", getComplaintById);
router.get("/complaints/user/:userId", authMiddleware, getUserComplaints);
router.put("/complaints/:id", authMiddleware, updateComplaintStatus);
router.delete("/complaints/:id", authMiddleware, deleteComplaint);

export default router;
