const getVendor = (req, res) => {
    try {
        const { address } = req.query;
        if (!address) throw new Error('Address is required');
        saveLog(address);
        res.json({ success: true, address });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getVendor }