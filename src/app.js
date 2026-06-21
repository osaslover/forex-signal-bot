const { sendSignal } = require("./telegram");

console.log("Forex Signal Bot Started");

setInterval(async () => {
  console.log("Sending test signal...");

  await sendSignal("🚀 Forex bot is running!");
  
}, 60000);
