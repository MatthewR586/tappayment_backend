const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNew = async (req, res) => {
    try {
        const { venueId, orderId } = req.body;
        const existingVenue = await prisma.orderHistory.count({
            where: {order_id: orderId}
        })
        if (existingVenue > 0) {
            const venue = await prisma.orderHistory.create({
                data: {
                    order_id: orderId,
                    venue_id: venueId
                }
            })    
            res.json({ success: true, message: venue });
        }
        res.json({ success: false, message: "Already exist" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = { createNew }