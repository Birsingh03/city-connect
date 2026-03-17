import express from "express";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import reportRoute from "../routes/reportRoute.js";
import complaintRoutes from "../routes/complaintRoutes.js";

export function createServerApplication() {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:8080", "http://localhost:8081"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.use("/api/auth", authRoutes);
  app.use("/api", reportRoute);
  app.use("/api", complaintRoutes);

  return app;
}
