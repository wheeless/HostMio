const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');
const { json } = require('express/lib/response');
// use $ and @ instead of - and _
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
);
exports.getLink = async (req, res) => {
  try {
    const url = await Url.findOne(
      { shortUrl: req.params.shortUrl },
      {
        shortUrl: 1,
        longUrl: 1,
        expireAt: 1,
        date: 1,
        clicks: 1,
      }
    );
    const parseIp = (req) =>
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    if (url !== null) {
      console.log(
        'Pinged: GET /' + req.params.shortUrl + ' from IP: ' + parseIp(req)
      );
      url.clicks++;
      await url.save();
      return res.json(url);
    } else {
      console.log(
        'Pinged: GET /' +
          req.params.shortUrl +
          ' from IP: ' +
          parseIp(req) +
          ' but no short url found.'
      );
      res.status(404).json({ message: 'No short url found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.getClicks = async (req, res) => {
  try {
    const url = await Url.findOne(
      { shortUrl: req.params.shortUrl },
      {
        shortUrl: 1,
        clicks: 1,
      }
    );
    const parseIp = (req) =>
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    if (url !== null) {
      console.log(
        'Pinged: GET /' +
          req.params.shortUrl +
          '/clicks from IP: ' +
          parseIp(req)
      );
      return res.json(url);
    } else {
      console.log(
        'Pinged: GET /' +
          req.params.shortUrl +
          ' from IP: ' +
          parseIp(req) +
          ' but no short url found.'
      );
      res.status(404).json({ message: 'No short url found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
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
          expireAt: req.body.expireAt,
        });
        // If no errors, create new url
      } else if (!req.body.shortUrl) {
        const urlCode = shortid.generate();
        // Create new url
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: urlCode,
          date: new Date(),
          expireAt: req.body.expireAt,
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
          expireAt: req.body.expireAt,
        };
        new Url(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      }
    }
  });
};

// const user = await userSch.findById(req.params.id, {
//   email_verified: 1,
//   roles: 1,
//   name: 1,
//   email: 1,
//   bio: 1,
//   updated_at: 1,
//   is_active: 1,
// });

exports.updateExpireAt = (req, res) => {
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress;

  console.log(
    'Pinged: PUT /api/v1/links/' +
      req.params.shortUrl +
      '/expireAt from IP: ' +
      parseIp(req)
  );

  Url.findOne({
    shortUrl: req.params.shortUrl,
  })
    .then((url) => {
      if (url) {
        if (!req.body.expireAt) {
          url.expireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        } else {
          url.expireAt = req.body.expireAt;
        }

        url.save().then((url) => {
          res.status(200).json(url);
        });
      } else {
        res.status(404).json({ message: 'No short url found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.updateLink = (req, res) => {
  Url.findById(req.params.id)
    .then((url) => {
      url.shortUrl = req.body.shortUrl;
      url.date = new Date();
      if (!req.body.expireAt) {
        url.expireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      } else {
        url.expireAt = req.body.expireAt;
      }
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
