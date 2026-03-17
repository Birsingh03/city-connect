import express from 'express';
import cors from 'cors';

export function createServerApplication() {
  const app = express();
  app.use(cors({
  origin: "http://localhost:8080", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true
}));
  app.use(express.json());
  app.get('/', (req, res) => {
    res.send("hello");
  });
  return app;
}
