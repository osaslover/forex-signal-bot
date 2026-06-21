const TelegramBot = require("node-telegram-bot-api");

const token = "8667680010:AAFwV5aSirDMZhQsOGtkzii1hZ3lDnoQpjk";
const chatId = "5929858944";

const bot = new TelegramBot(token);

async function sendSignal(message) {
  try {
    await bot.sendMessage(chatId, message);
    console.log("Message sent");
  } catch (error) {
    console.error(error);
  }
}

sendSignal("🚀 Test message from Render");
