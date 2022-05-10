const mongoose = require('mongoose');

const urlV2Schema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  date: { type: Date, default: Date.now },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
  },
  APIKey: String,
});

module.exports = mongoose.model('UrlV2', urlV2Schema);
