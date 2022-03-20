const mongoose = require('mongoose');

const urlV2Schema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: Date.now() + 2592000000 },
  APIKey: String,
});

module.exports = mongoose.model('UrlV2', urlV2Schema);
