// server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/api/reddit", async (req, res) => {
  try {
    const response = await fetch("https://www.reddit.com/r/reactjs.json", {
      headers: {
        "User-Agent": "node:reddit.fetcher:v1.0 (by /u/ak433778)",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Reddit responded with status ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
