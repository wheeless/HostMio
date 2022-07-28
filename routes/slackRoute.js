const express = require('express');
const router = express.Router();
const slackController = require('../controllers/slack');

router.post('/massMail', slackController.slackWebhook);
// router.post('/massMail/text', slackController.sendText);

module.exports = router;
