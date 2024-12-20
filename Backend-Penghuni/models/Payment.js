// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  period: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  extras: { type: Array, default: [] },
  paymentMethod: { type: String, required: true },
  bankName: { type: String },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
