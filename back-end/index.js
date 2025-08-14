const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

console.log("Starting backend server...");

// ===== Endpoint login =====
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Login gagal" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Endpoint dashboard =====
app.get("/dashboard", async (req, res) => {
  try {
    // Pastikan tabel dashboard ada, atau bisa gunakan dummy data sementara
    const result = await db.query(
      "SELECT users, orders, revenue FROM dashboard LIMIT 1"
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      // Jika tabel dashboard kosong atau tidak ada, gunakan dummy data
      res.json({ users: 10, orders: 5, revenue: 200 });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Jalankan server =====
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
