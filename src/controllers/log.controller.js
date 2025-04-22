const { writeLog } = require('../services/log.service');

const saveLog = async (req, res, next) => {
  try {
    const { level, message, context } = req.body;
    await writeLog(level, message, context);
    res.status(200).json({ message: 'Log saved successfully' });
  } catch (error) {
    next(error); // Forward to error handler
  }
};

module.exports = { saveLog };