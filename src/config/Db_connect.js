const mongoose = require('mongoose');
require('dotenv').config();

const db_connection = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully...');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = db_connection;
