const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/orderdb');
  console.log('MongoDB connected');
};

module.exports = connectDB;