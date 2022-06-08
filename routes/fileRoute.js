const express = require('express');
const router = express.Router();
const fileHandler = require('../controllers/fileHandler');
var cors = require('cors');

// File Controller (route handlers).
router.post('/api/slack/massMail', fileHandler.slackWebhook);
router.get(
  '/api/files/downloads/:fileName',
  fileHandler.downloadFileController
);
router.post('/api/files/upload', fileHandler.upload);
router.get('/api/files/downloads/', fileHandler.showDownloads);
router.post('/api/files/uploadNew', fileHandler.uploadNew);
module.exports = router;
