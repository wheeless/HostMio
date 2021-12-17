var express = require('express');
var router = express.Router();
const Url = require('../models/Url');
var cors = require('cors');

router.get('/:shortUrl', cors('*'), async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
