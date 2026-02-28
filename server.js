import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();

// Enable CORS so your Vue app on GitHub Pages can access this API
app.use(cors({
  origin: "*", // Allows access from any domain (Standard for Labs)
  methods: ["GET", "POST"]
}));

app.use(express.json()); 

// Routes
app.use("/api/moods", moodRoutes);

// Root Health Check
app.get("/", (req, res) => {
  res.send("🚀 Wellness AI API is live and running on Render!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});