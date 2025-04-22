const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});

const sendNotification = (data) => {
    if(data?.body?.type == 'orders.delivery.completed') {
        console.log(data?.body?.data.orderId, (data?.body?.data.payment.received.amount - 2).toFixed(2))
        // send telegram notification 
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}\nOrder ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
    res.status(200).json({});
};

module.exports = { sendNotification };