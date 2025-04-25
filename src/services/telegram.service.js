const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});
const groupBot = new TelegramBot(process.env.TELEGRAM_BOT_GROUP_TOKEN, {polling: false});
const sendNotification = (data, res) => {
    if(data?.body?.type == 'orders.delivery.completed') {
        console.log(data?.body?.data.orderId, (data?.body?.data.payment.received.amount - 2).toFixed(2))
        // send telegram notification 
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}\nOrder ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
    res.status(200).json({});
};


const sendNotificationDev = async (data, res) => {
    try {
        console.log(data?.body?.type)
        if(data?.body?.type == 'orders.delivery.completed') {
            const orderWithVenue = await prisma.orderHistory.findUnique({
                where: {
                    order_id: data?.body?.data.orderId
                },
                include: {
                    venue: true
                }
            })
            // send telegram notification 
            groupBot.sendMessage(Number(orderWithVenue?.venue.chatId), `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}\nOrder ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to group!")).catch(err => console.log('Error:', err.message));
        }
        res.status(200).json({});            
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
};

module.exports = { sendNotification, sendNotificationDev };