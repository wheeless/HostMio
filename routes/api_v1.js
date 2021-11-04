var express = require('express');
var router = express.Router();
const validUrl = require('valid-url');
// const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');

router.post('/shorten', (req, res) => {
  let errors = [];

  const baseUrl = config.get('baseUrl');

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }
  if (!req.body.longUrl) {
    errors.push({
      text: 'Please add a long URL',
    });
  }
  if (!req.body.shortUrl) {
    errors.push({
      text: 'Please add a short URL',
    });
  }
  Url.findOne({
    $or: [
      {
        longUrl: req.body.longUrl,
      },
      {
        shortUrl: req.body.shortUrl,
      },
    ],
  }).then((url) => {
    if (url) {
      res.json('LongURL/ShortURL already exists');
    } else {
      if (errors.length > 0) {
        res.json({
          errors: errors,
          longUrl: req.body.longUrl,
          shortUrl: req.body.shortUrl,
        });
      } else {
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: req.body.shortUrl,
        };
        new Url(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      }
    }
  });
});

module.exports = router;
