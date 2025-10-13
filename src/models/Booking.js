const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Confirmed', 'Cancelled'] 
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
