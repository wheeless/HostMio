const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  date: { type: Date, default: Date.now },
  expireAt: { type: Date, default: Date.now() + 2592000000 },
});

module.exports = mongoose.model('Url', urlSchema);
