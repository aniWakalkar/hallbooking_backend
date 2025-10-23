const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hallToServe: { type: String, required: true },
  contactInfo: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  isBooked: { type: Boolean, default: false},
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
