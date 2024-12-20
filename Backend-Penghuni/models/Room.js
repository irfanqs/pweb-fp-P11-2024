const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
});

module.exports = mongoose.model('Room', roomSchema);