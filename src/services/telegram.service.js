const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});

const sendNotification = (data) => {
    if(data?.body?.type == 'purchase.succeeded') {
        console.log(data?.body)
        // send telegram notification 
        // bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}
        // Order ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
};

module.exports = { sendNotification };