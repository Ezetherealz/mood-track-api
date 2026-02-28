import express from "express";
import axios from "axios"; // Ensure axios is installed in your backend too!

const router = express.Router();

// This handles POST requests to http://localhost:3000/api/moods
router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body;

  try {
    // 1. (Optional) Here you would save to MySQL as you did in Lab 4
    console.log(`Received mood from ${full_name}: ${mood_text}`);

    // 2. Call Gemini/AI (Placeholder for Lab 5 logic)
    // For the lab, you can return a simulated AI response if your key is down
    const aiResponse = `Hi ${full_name}, I hear that you're feeling '${mood_text}'. Remember to take a deep breath and stay hydrated!`;

    res.json({
      success: true,
      ai_message: aiResponse
    });
  } catch (error) {
    console.error("Error in mood route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;