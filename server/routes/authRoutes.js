import express from "express";
import { signup, login } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();


router.post(
  "/signup",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),

    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  signup
);




router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .notEmpty()
      .withMessage("Password required"),
  ],
  login
);



export default router;