// server.js
const express = require("express");
const cors = require("cors"); // Import cors
const app = express();

// Enable CORS
app.use(cors());

app.get("/api/reddit", async (req, res) => {
  try {
    const response = await fetch("https://www.reddit.com/r/reactjs.json", {
      headers: {
        "User-Agent": "node:reddit.fetcher:v1.0 (by /u/ak433778)",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err); // log actual error
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
