const express = require("express");
const admin_routes = express.Router();

const Hall = require("../models/Hall");
const Booking = require("../models/Booking");
const { verifyAdmin } = require("../middleware/Auth");

// Create a hall (admin only)
admin_routes.post("/halls", verifyAdmin, async (req, res) => {
  const { name, location, capacity, pricePerHour } = req.body;

  if (!name || !location || !capacity || !pricePerHour) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  try {
    const oldHall = await Hall.findOne({ name, location });
    if (oldHall)
      return res.status(409).send({ message: "Hall already exists" });

    const newHall = new Hall({ name, location, capacity, pricePerHour });
    await newHall.save();

    res
      .status(201)
      .send({ message: "Hall created successfully", HallId: newHall._id });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Get booking for a hall (admin only)
admin_routes.get("/bookings/hall/:hallId", verifyAdmin, async (req, res) => {
  const { hallId } = req.params;

  try {
    // Populate hallId and userId to get full details
    const bookings = await Booking.find({ hallId })
      .populate("hallId") // gets all hall details
      .populate("userId"); // gets all user details

    res.status(200).send(bookings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Update a booking (admin only)
admin_routes.put("/bookings/:id", verifyAdmin, async (req, res) => {
  const { hallId, userId, date, startTime, endTime, status } = req.body;

  if (!hallId || !userId || !date || !startTime || !endTime || !status) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { hallId, userId, date, startTime, endTime, status },
      { new: true }
    );

    if (!updatedBooking)
      return res.status(404).send({ message: "Booking not found" });

    res
      .status(200)
      .send({ message: "Booking updated successfully", updatedBooking });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Cancel a booking (admin only)
admin_routes.delete("/bookings/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking)
      return res.status(404).send({ message: "Booking not found" });

    res
      .status(200)
      .send({ message: "Booking canceled successfully", deletedBooking });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = admin_routes;
