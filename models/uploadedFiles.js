const req = require('express/lib/request');
const mongoose = require('mongoose');

const UploadedFilesSchema = new mongoose.Schema({
  fileName: String,
  uploadedUrl: String,
  downloadable: Boolean,
  size: Number,
  shortenedUrl: {
    type: String,
    default: function sendToShorten(uploadedUrl) {
      return `${process.env.BASE_URL}/api/v1/links/${uploadedUrl}`;
    },
  },
  date: { type: Date, default: () => new Date() },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
  },
  downloads: {
    type: Number,
    required: true,
    default: 0,
  },
});

UploadedFilesSchema.methods.sendToShorten = function sendToShorten(req, res) {
  fetch(`${process.env.BASE_URL}/api/v1/links/`, {
    method: 'POST',
    body: JSON.stringify({
      longUrl: uploadedUrl,
    }),
  }).then((response) => response.json());
};

module.exports = mongoose.model('UploadedFiles', UploadedFilesSchema);
