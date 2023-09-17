const axios = require("axios");

async function send(message) {
  await axios.get(
    `https://api.telegram.org/bot${
      process.env.TELEGRAM_BOT_TOKEN
    }/sendMessage?chat_id=${
      process.env.TELEGRAM_CHAT_ID
    }&text=${encodeURIComponent(message)}`
  );
}

module.exports = { send };
