import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

// Enable CORS for all origins (Required for GitHub Pages)
app.use(cors());
app.use(express.json());

// Database Connection Pool using your Railway credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false } 
});

// Test Connection on Startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to Railway Cloud Database!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

// POST endpoint: Receives data from Vue and saves to MySQL
app.post('/api/moods', async (req, res) => {
  const { name, mood, note } = req.body; 
  const now = new Date();

  if (!name || !mood) {
    return res.status(400).json({ error: "Name and Mood are required." });
  }

  try {
    // 1. Ensure user exists
    await pool.query(
      'INSERT IGNORE INTO users (full_name, email, created_at) VALUES (?, ?, ?)',
      [name, `${name.replace(/\s+/g, '').toLowerCase()}@example.com`, now]
    );

    // 2. Insert the mood entry
    const [result] = await pool.query(
      'INSERT INTO mood_entries (full_name, mood, note, created_at) VALUES (?, ?, ?, ?)', 
      [name, mood, note || '', now]
    );

    console.log(`✅ Success! Data saved for: ${name}`);
    
    // Send back a success response
    res.status(200).json({ 
      success: true, 
      id: result.insertId,
      message: "Mood recorded! You're doing great, and your feelings are valid." 
    });

  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ error: "Database failure", details: err.message });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 Wellness AI API is live and healthy.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});