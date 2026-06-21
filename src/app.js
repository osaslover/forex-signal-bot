const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Forex Signal Bot Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep your bot logic here
setInterval(() => {
  console.log("Scanning market...");
}, 60000);
