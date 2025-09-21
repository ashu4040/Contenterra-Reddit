// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/reddit", async (req, res) => {
  try {
    const redditURL = encodeURIComponent(
      "https://www.reddit.com/r/reactjs.json"
    );
    const proxyURL = `https://thingproxy.freeboard.io/fetch/${redditURL}`;

    const response = await fetch(proxyURL, {
      headers: {
        "User-Agent": "node:reddit.fetcher:v1.0 (by /u/ak433778)",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Proxy responded with status ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
