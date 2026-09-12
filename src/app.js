require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

console.log("APP.JS LOADED");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// TELEGRAM CONFIG
// ============================

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN) {
  console.log("WARNING: TELEGRAM_TOKEN is missing");
}

if (!CHAT_ID) {
  console.log("WARNING: TELEGRAM_CHAT_ID is missing");
}

let bot = null;

if (TELEGRAM_TOKEN) {
  bot = new TelegramBot(TELEGRAM_TOKEN, {
    polling: true
  });

  console.log("Telegram bot started");
}

// ============================
// EXPRESS
// ============================

app.get("/", (req, res) => {
  res.send("Smart Signal Bot Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    telegram: !!bot
  });
});

// ============================
// TELEGRAM COMMANDS
// ============================

if (bot) {

  bot.onText(/^\/start$/, async (msg) => {

    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      `🤖 Smart Signal Bot

Bot is online.

Commands:

/status - Check bot status
/scan - Run market scan
/help - Show commands

⚠️ Signals are probability-based and are not guaranteed.`
    );

  });


  bot.onText(/^\/status$/, async (msg) => {

    await bot.sendMessage(
      msg.chat.id,
      "🟢 Bot is online and ready."
    );

  });


  bot.onText(/^\/help$/, async (msg) => {

    await bot.sendMessage(
      msg.chat.id,
      `🤖 Smart Signal Bot

/start - Start bot
/status - Check status
/scan - Scan market
/help - Show commands`
    );

  });


  bot.onText(/^\/scan$/, async (msg) => {

    await bot.sendMessage(
      msg.chat.id,
      "🔍 Starting multi-timeframe market analysis..."
    );

    await runMarketScan(msg.chat.id);

  });

}


// ============================
// MARKET SCANNER
// ============================

async function runMarketScan(chatId) {

  console.log("Starting market scan...");

  /*
   * REAL market data will be connected here.
   *
   * We will analyze:
   *
   * 1 minute
   * 5 minutes
   * 15 minutes
   *
   * The bot will then select the strongest
   * setup instead of forcing a particular
   * timeframe.
   */

  const result = {
    asset: "WAITING FOR DATA",
    direction: "NO TRADE",
    timeframe: "-",
    confidence: 0
  };

  console.log(result);

  if (bot) {

    await bot.sendMessage(
      chatId,
      `📊 MARKET ANALYSIS

Asset: ${result.asset}

Direction: ${result.direction}

Timeframe: ${result.timeframe}

Confidence: ${result.confidence}%

⏳ Real market-data connection is the next step.`
    );

  }

}


// ============================
// SERVER
// ============================

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});