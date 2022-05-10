const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  date: { type: Date, default: Date.now },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
  },
  expireRefresh: {
    type: Boolean,
    default: false,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 1000,
  },
});

module.exports = mongoose.model('Url', urlSchema);
