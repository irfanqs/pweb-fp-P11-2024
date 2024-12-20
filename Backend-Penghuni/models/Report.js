// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true },
  type: { type: String, required: true }, 
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);
