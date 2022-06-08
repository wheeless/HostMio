const express = require('express');
const router = express.Router();
const slackController = require('../controllers/slack');

router.post('/massMail', slackController.slackWebhook);

module.exports = router;
