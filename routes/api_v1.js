var express = require('express');
var router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');

router.get('/links', (req, res) => {
  Url.find()
    .then((url) => {
      res.json(url);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
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
  // if (!req.body.shortUrl) {
  //   errors.push({
  //     text: 'Please add a short URL',
  //   });
  // }
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
      } else if (!req.body.shortUrl) {
        const urlCode = shortid.generate();
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: urlCode,
          date: new Date(),
        };
        new Url(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      } else {
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: req.body.shortUrl,
          date: new Date(),
        };
        new Url(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      }
    }
  });
});

router.delete('/:id', (req, res) => {
  Url.findByIdAndRemove(req.params.id)
    .then((url) => {
      res.json(url + ' deleted');
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
