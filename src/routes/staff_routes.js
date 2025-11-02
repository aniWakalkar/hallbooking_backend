const express = require("express");
const staff_routes = express.Router();
const Staff = require("../models/Staff");
const { verifyAdmin } = require("../middleware/Auth");

staff_routes.post("/staff", verifyAdmin, async (req, res) => {
  const { name, hallToServe, contactInfo, pricePerHour } = req.body;

  if (!name || !hallToServe || !contactInfo || !pricePerHour) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  try {
    const oldStaff = await Staff.findOne({ name });
    if (oldStaff)
      return res.status(409).send({ message: "Staff already exists" });

    const newStaff = new Staff({
      name,
      hallToServe,
      contactInfo,
      pricePerHour,
    });
    await newStaff.save();

    res
      .status(201)
      .send({ message: "Staff created successfully", StaffId: newStaff._id });
    // res.status(201).send({ message: 'Staff created successfully' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = staff_routes;
