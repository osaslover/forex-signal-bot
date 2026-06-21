const express = require("express");

console.log("APP.JS LOADED");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
