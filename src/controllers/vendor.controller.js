const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVendor = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) throw new Error('Address is required');
        const venue = await prisma.venue.findUnique({
            where: {link: address}
        })
        res.json({ success: true, message: venue });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = { getVendor }