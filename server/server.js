import express from "express";
import pg from "pg";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;
const connectionString = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Guestbook Server is running!");
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/messages", async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).send("Username and message are required.");
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (username, message) VALUES ($1, $2) RETURNING *",
      [username, message],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
