// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// Reddit OAuth credentials
const CLIENT_ID = "EjPzx7j9HdxIts86B6CV9A";
const CLIENT_SECRET = "NnHhNvMyd_qyLQD5I6g4eGKLSV8B5w";
const REDDIT_USER_AGENT = "node:reddit.fetcher:v1.0 (by /u/ak433778)";
const REDIRECT_URI = "http://localhost:5000/callback";

// Load saved refresh token if available
let refresh_token = null;
if (fs.existsSync("token.json")) {
  refresh_token = JSON.parse(fs.readFileSync("token.json")).refresh_token;
}

// Step 1: Login route
app.get("/login", (req, res) => {
  const url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=random123&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=read`;
  res.redirect(url);
});

// Step 2: Callback route
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received");

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
  });

  const data = await response.json();
  if (data.refresh_token) {
    refresh_token = data.refresh_token;
    fs.writeFileSync("token.json", JSON.stringify({ refresh_token }));
  }

  res.send("Authorization successful! Refresh token saved.");
});

// Helper: Get access token using refresh_token
async function getAccessToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  });

  const data = await response.json();
  return data.access_token;
}

// Step 3: Use token to fetch Reddit posts
app.get("/api/reddit", async (req, res) => {
  try {
    if (!refresh_token)
      return res
        .status(400)
        .json({ error: "No refresh token. Please visit /login first." });

    const token = await getAccessToken();

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
