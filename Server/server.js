// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// Reddit API credentials (from your Reddit App)
const CLIENT_ID = "EjPzx7j9HdxIts86B6CV9A";
const CLIENT_SECRET = "NnHhNvMyd_qyLQD5I6g4eGKLSV8B5w";
const USER_AGENT = "script:my.reddit.app:v1.0 (by /u/ak433778)";

// Function to get a short-lived access token
async function getAccessToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

// API route
app.get("/api/reddit", async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await fetch("https://oauth.reddit.com/r/reactjs/hot", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": USER_AGENT,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching Reddit:", err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
