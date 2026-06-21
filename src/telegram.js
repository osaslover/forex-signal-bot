const TelegramBot = require("node-telegram-bot-api/src/telegram");

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token);

async function sendSignal(message) {
  try {
    await bot.sendMessage(chatId, message);
    console.log("Telegram message sent");
  } catch (error) {
    console.log("Telegram error:", error.message);
  }
}

module.exports = { sendSignal };
