const axios = require("axios");
const FormData = require("form-data");

async function send(message) {
  await axios.get(
    `https://api.telegram.org/bot${
      process.env.TELEGRAM_BOT_TOKEN
    }/sendMessage?chat_id=${
      process.env.TELEGRAM_CHAT_ID
    }&text=${encodeURIComponent(message)}`
  );
}

async function sendTxtFile(fileName, content) {
  const form = new FormData();
  form.append("document", content, fileName);
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument?chat_id=${process.env.TELEGRAM_CHAT_ID}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}

module.exports = { send, sendTxtFile };
