const mongoose = require('mongoose');

const urlV2Schema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  expireAt: { type: String, default: Date.now },
  createdAt: { type: String, default: Date.now },
  APIKey: String,
});

module.exports = mongoose.model('UrlV2', urlV2Schema);
