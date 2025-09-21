// server.js
const express = require("express");
const cors = require("cors"); // Import cors
const app = express();

// Enable CORS
app.use(cors());

app.get("/api/reddit", async (req, res) => {
  try {
    const response = await fetch("https://www.reddit.com/r/reactjs.json");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
