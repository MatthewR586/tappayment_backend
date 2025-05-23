const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logRoutes = require('./routes/log.routes');
const vendorRoutes = require('./routes/vendor.routes');
const paymentRoutes = require('./routes/payment.routes');
const { sendNotification, sendNotificationDev, sendTelegramNotification } = require('./services/telegram.service');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));  // HTTP request logger

// Routes
app.use('/api/logs', logRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/payment', paymentRoutes);

// Webhook
app.use('/webhook', sendNotification)
app.use('/webhookdev', sendNotificationDev)
app.use('/wert', sendTelegramNotification)
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

console.log(process.env.TELEGRAM_BOT_TOKEN)

module.exports = app;