const formatLogEntry = (level, message, context) => {
    return `[${new Date().toISOString()}] [${level}] ${message} ${JSON.stringify(context)}\n`;
  };
  
  module.exports = { formatLogEntry };