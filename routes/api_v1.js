var express = require('express');
var router = express.Router();
const validUrl = require('valid-url');
// const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:shortUrl', async (req, res) => {
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
router.post('/', function (req, res, next) {
  link = req.body.link;
  short = req.body.short;
});

router.put('/', function (req, res, next) {
  res.json({ message: 'API v1' });
});

router.delete('/', function (req, res, next) {
  res.json({ message: 'API v1' });
});

module.exports = router;
