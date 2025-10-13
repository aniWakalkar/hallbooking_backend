require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db_connection = require('./config/Db_connect');
const verifyAdmin = require('./middleware/Auth');

require('./models/User');
require('./models/Hall');
require('./models/Booking');

const User = require('./models/User');
const Hall = require('./models/Hall');
const Booking = require('./models/Booking');

const app = express();

app.use(cors());
app.use(express.json());

db_connection();

const verifytoken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(404).send({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};



// Test
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role ) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(409).send({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // default to user
    });

    const newUser = await user.save();
    res.status(201).send({ message: 'User created successfully', userId: newUser._id });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Please fill all fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).send({ user_id: user._id, role: user.role,  message: 'Login successful', token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get all halls (public)
app.get('/api/halls', async (req, res) => {
  try {
    const halls = await Hall.find();
    res.status(200).send(halls);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Create a hall (admin only)
app.post('/api/halls', verifyAdmin, async (req, res) => {
  const { name, location, capacity, pricePerHour } = req.body;

  if (!name || !location || !capacity || !pricePerHour) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }

  try {
    const oldHall = await Hall.findOne({ name, location });
    if (oldHall) return res.status(409).send({ message: 'Hall already exists' });

    const newHall = new Hall({ name, location, capacity, pricePerHour });
    await newHall.save();

    res.status(201).send({ message: 'Hall created successfully', HallId: newHall._id });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  const { hallId, userId, date, startTime, endTime, status } = req.body;

  if (!hallId || !userId || !date || !startTime || !endTime || !status) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }

  try {
    const booking = new Booking({ hallId, userId, date, startTime, endTime, status });
    await booking.save();

    res.status(201).send({ message: 'Booking created successfully', bookingId: booking._id });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Get booking for a hall (admin only)
app.get('/api/bookings/hall/:hallId', verifyAdmin, async (req, res) => {
  const { hallId } = req.params;

  try {
    // Populate hallId and userId to get full details
    const bookings = await Booking.find({ hallId })
      .populate('hallId')  // gets all hall details
      .populate('userId'); // gets all user details

    res.status(200).send(bookings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Update a booking (admin only)
app.put('/api/bookings/:id', verifyAdmin, async (req, res) => {
  const { hallId, userId, date, startTime, endTime, status } = req.body;

  if (!hallId || !userId || !date || !startTime || !endTime || !status) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { hallId, userId, date, startTime, endTime, status },
      { new: true }
    );

    if (!updatedBooking) return res.status(404).send({ message: 'Booking not found' });

    res.status(200).send({ message: 'Booking updated successfully', updatedBooking });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Get my bookings (logged-in user)
app.get('/api/bookings/my', verifytoken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hallId')  
      .populate('userId');

    res.status(200).send(bookings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Cancel a booking (admin only)
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) return res.status(404).send({ message: 'Booking not found' });

    res.status(200).send({ message: 'Booking canceled successfully', deletedBooking });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});




const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
