
const sendNotification = (data) => {
    if(data?.body?.type == 'orders.payment.succeeded') {
        console.log(data?.body?.data.orderId, data?.body?.data.payment.received.amount - 2)
    }
};

module.exports = { sendNotification };