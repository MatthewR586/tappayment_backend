const fs = require('fs');
const path = require('path');
const { formatLogEntry } = require('../utils/logger');

const LOG_FILE = path.join(__dirname, '../../logs/app.log');

const writeLog = (level, message, context = {}) => {
  return new Promise((resolve, reject) => {
    const logEntry = formatLogEntry(level, message, context);
    fs.appendFile(LOG_FILE, logEntry, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = { writeLog };