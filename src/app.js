const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Forex bot is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  console.log("Scanning market...");
}, 60000);
