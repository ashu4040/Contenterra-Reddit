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
    const proxyURL = `https://api.allorigins.win/get?url=${redditURL}`;

    const response = await fetch(proxyURL);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Proxy responded with status ${response.status}` });
    }

    const textData = await response.json();
    // AllOrigins wraps the original response in 'contents'
    const data = JSON.parse(textData.contents);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

// Use dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
