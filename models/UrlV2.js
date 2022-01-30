const mongoose = require('mongoose');

const urlV2Schema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
});

module.exports = mongoose.model('UrlV2', urlV2Schema);
