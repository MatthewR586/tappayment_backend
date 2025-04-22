const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});
let amount = 0;
const sendNotification = (data) => {
    if(data?.body?.type == 'orders.payment.succeeded') {
        amount = data?.body?.data.payment.received.amount - 2;
    }
    if(data?.body?.type == 'purchase.succeeded') {
        console.log(data?.body)
        // send telegram notification 
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(amount).toFixed(2)}\nOrder ID: ${data?.body?.orderId}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
};

module.exports = { sendNotification };