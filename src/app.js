require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        bot: "Smart Trading Bot",
        version: "1.0.0"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log("SMART TRADING BOT");
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
});