const express = require('express');
const router = express.Router();
const fileHandler = require('../controllers/fileHandler');
var cors = require('cors');

// File Controller (route handlers).
router.get('/downloads/:fileName', fileHandler.downloadFileController);
router.post('/upload', fileHandler.upload);
router.get('/downloads/', fileHandler.showDownloads);
// router.post('/uploadNew', fileHandler.uploadNew);
module.exports = router;
