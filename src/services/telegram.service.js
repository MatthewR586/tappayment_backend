const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});
const groupBot = new TelegramBot(process.env.TELEGRAM_BOT_GROUP_TOKEN, {polling: false});
const sendNotification = (data, res) => {
    axios.post('https://creditpay.ecmrare.com/crossmint/webhook', {
        ...data.body,
    }, {
        headers: {
            'svix-id': data.headers['svix-id'],
            'svix-timestamp': data.headers['svix-timestamp'],
            'svix-signature': data.headers['svix-signature'],
        },
        params: {
            ...data.query,
        },
        validateStatus: () => true,
    });
    if(data?.body?.type == 'orders.delivery.completed') {
        console.log(data?.body?.data.orderId, (data?.body?.data.payment.received.amount - 2).toFixed(2))
        // send telegram notification 
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}\nOrder ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
    res.status(200).json({});
};

const sendTelegramNotification = (req, res) => {
    if(req?.body?.type == 'order_complete') {
        // send telegram notification 
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `💸 Amount: ${(req?.body?.order.quote_amount).toFixed(2)}\nOrder ID: ${req?.body?.order.id}`).then(() => console.log("Message sent to channel!")).catch(err => console.log('Error:', err.message));
    }
    res.status(200).json({});
}

const sendNotificationDev = async (data, res) => {
    try {
        if(data?.body?.type == 'orders.delivery.initiated') {
            const vendor = await prisma.venue.findUnique({
                where: {
                    address: data?.body.data.lineItems[0].callData.vendorAddress
                }
            })
            console.log({orderId: data?.body?.data?.orderId})
            const existingVenue = await prisma.orderHistory.count({
                where: {order_id: data?.body?.data?.orderId}
            })
            console.log({existingVenue, orderId: data?.body?.data?.orderId})
            if (existingVenue == 0) {
                const venue = await prisma.orderHistory.create({
                    data: {
                        order_id: data?.body?.data?.orderId,
                        venue_id: vendor.id
                    }
                })    
                console.log({venue})
            }
        }

        if(data?.body?.type == 'orders.delivery.completed') {
            console.log(data?.body.data.lineItems[0].callData.vendorAddress)
            const orderWithVenue = await prisma.orderHistory.findUnique({
                where: {
                    order_id: data?.body?.data.orderId
                },
                include: {
                    venue: true
                }
            })
            if (!orderWithVenue.status) {
                groupBot.sendMessage(Number(orderWithVenue?.venue.chatId), `💸 Amount: ${(data?.body?.data.payment.received.amount - 2).toFixed(2)}\nOrder ID: ${data?.body?.data.orderId}`).then(() => console.log("Message sent to group!")).catch(err => console.log('Error:', err.message));
                await prisma.orderHistory.update({
                    where: {
                      id: orderWithVenue.id
                    },
                    data: {
                      status: true
                    }
                  });
                  console.log("Order status updated to true");
            }
            // send telegram notification 
        }
        res.status(200).json({});            
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
};

module.exports = { sendNotification, sendNotificationDev, sendTelegramNotification };