// server.js (CommonJS)
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// Reddit OAuth credentials
const CLIENT_ID = "EjPzx7j9HdxIts86B6CV9A";
const CLIENT_SECRET = "NnHhNvMyd_qyLQD5I6g4eGKLSV8B5w";
const REDDIT_USER_AGENT = "node:reddit.fetcher:v1.0 (by /u/ak433778)";

// Function to get OAuth token
async function getToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Route to fetch Reddit posts
app.get("/api/reddit", async (req, res) => {
  try {
    const token = await getToken();

    const response = await fetch("https://oauth.reddit.com/r/reactjs/hot", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": REDDIT_USER_AGENT,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
