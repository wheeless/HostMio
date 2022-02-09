const mongoose = require('mongoose');
const generateApiKey = require('generate-api-key');

const AuthSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: { type: String, default: Date.now },
  APIKey: String,
});

module.exports = mongoose.model('Auth', AuthSchema);
