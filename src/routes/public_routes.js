const express = require("express");
const public_routes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Hall = require("../models/Hall");

// Registe
public_routes.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body; // role is for testing purpose only

  if (!name || !email || !password || !role) {
    return res.status(400).send({ message: "Please fill all fields" });
  }

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res.status(409).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default to user
    });

    const newUser = await user.save();
    res
      .status(201)
      .send({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Login user
public_routes.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ message: "Please fill all fields" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res
      .status(200)
      .send({ role: user.role, message: "Login successful", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get all halls (public)
public_routes.get("/halls", async (req, res) => {
  try {
    const halls = await Hall.find();
    res.status(200).send(halls);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = public_routes;
