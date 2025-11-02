const express = require("express");
const user_routes = express.Router();
const { verifytoken } = require("../middleware/Auth");

const Booking = require("../models/Booking");

// Create booking
user_routes.post("/bookings", verifytoken, async (req, res) => {
  const { hallId, date, startTime, endTime, status } = req.body;

  if (!hallId || !date || !startTime || !endTime || !status) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  const userId = req.user._id;

  try {
    const booking = new Booking({
      hallId,
      userId,
      date,
      startTime,
      endTime,
      status,
    });
    await booking.save();

    res.status(201).send({
      message: "Booking created successfully",
      bookingId: booking._id,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Get my bookings (logged-in user)
user_routes.get("/bookings/my", verifytoken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("hallId")
      .populate("userId");

    res.status(200).send(bookings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = user_routes;
