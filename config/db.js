const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const dbTest = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'localhost:27017/test', {
      useNewUrlParser: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
