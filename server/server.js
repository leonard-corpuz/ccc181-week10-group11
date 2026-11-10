const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Demo account
const DEMO_EMAIL = process.env.DEMO_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;
const DEMO_NAME = process.env.DEMO_NAME;

// Demo session token
const DEMO_TOKEN = "campusconnect-demo-token";

// GET /api/v1/health
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running"
  });
});

// POST /api/v1/sessions
app.post("/api/v1/sessions", (req, res) => {
  const { email, password } = req.body;

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  res.status(200).json({
    message: "Login successful",
    token: DEMO_TOKEN
  });
});

// GET /api/v1/users/me
app.get("/api/v1/users/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${DEMO_TOKEN}`) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  res.status(200).json({
    id: 1,
    email: DEMO_EMAIL,
    name: DEMO_NAME
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
