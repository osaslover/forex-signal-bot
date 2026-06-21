const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token);

async function sendSignal(message) {
  await bot.sendMessage(chatId, message);
}

module.exports = { sendSignal };
