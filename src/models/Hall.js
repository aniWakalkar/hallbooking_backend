const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerHour: { type: Number, required: true }
});

const Hall = mongoose.model('Hall', hallSchema);
module.exports = Hall;
