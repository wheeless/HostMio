const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');

exports.getLink = async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    const parseIp = (req) =>
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    if (url !== null) {
      console.log('Redirecting to: ' + url.longUrl);
      console.log(
        'Pinged: GET /' + req.params.shortUrl + ' from IP: ' + parseIp(req)
      );
    } else {
      console.log(
        'Pinged: GET /' +
          req.params.shortUrl +
          ' from IP: ' +
          parseIp(req) +
          ' but no short url found'
      );
    }

    if (url !== null) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};

exports.getLinks = (req, res) => {
  Url.find()
    .then((url) => {
      res.json(url);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress;

  console.log('Pinged: GET /api/v1/links from IP: ' + parseIp(req));
};

exports.createLink = (req, res) => {
  let errors = [];

  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress;

  console.log('Pinged: POST /api/v1/links/ from IP: ' + parseIp(req));

  // Check if long url exists
  if (!req.body.longUrl) {
    errors.push({
      text: 'Please add a long URL',
    });
  }
  // Check long url is valid
  if (!validUrl.isUri(req.body.longUrl)) {
    errors.push({
      text: 'Invalid url',
    });
  }
  // Check if errors array is empty
  Url.findOne({
    $or: [
      {
        shortUrl: req.body.shortUrl,
      },
    ],
  }).then((url) => {
    if (url) {
      res.json('ShortURL already exists');
    } else {
      // Check if errors array is empty
      if (errors.length > 0) {
        res.json({
          errors: errors,
          longUrl: req.body.longUrl,
          shortUrl: req.body.shortUrl,
        });
        // If no errors, create new url
      } else if (!req.body.shortUrl) {
        const urlCode = shortid.generate();
        // Create new url
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: urlCode,
          date: new Date(),
        };
        // Save url
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
};

exports.updateLink = (req, res) => {
  Url.findById(req.params.id)
    .then((url) => {
      url.longUrl = req.body.longUrl;
      url.shortUrl = req.body.shortUrl;
      url.date = new Date();
      url.save().then((url) => {
        res.json(url);
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.deleteLink = (req, res) => {
  Url.findByIdAndRemove(req.params.id)
    .then((url) => {
      res.json(url + ' deleted');
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
