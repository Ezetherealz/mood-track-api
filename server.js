import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();

// 1. Enable CORS for Vue (Port 5173)
app.use(cors()); 
app.use(express.json()); 

// 2. Define Routes
app.use("/api/moods", moodRoutes);

// 3. Health Check
app.get("/", (req, res) => {
  res.send("🚀 API is running perfectly!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});