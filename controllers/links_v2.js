const validTEMP = require('valid-url');
const shortid = require('shortid');
const UrlV2 = require('../models/UrlV2');

const parseIp = (req) =>
  req.headers['x-forwarded-for']?.split(',').shift() ||
  req.socket?.remoteAddress;

exports.getLink = async (req, res) => {
  try {
    const apiKey = req.query.APIKey;
    if (!apiKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const urlCheck = await UrlV2.findOne({
      $and: [{ shortUrl: req.params.shortUrl }, { APIKey: apiKey }],
    });

    parseIp(req);

    console.log(
      'Pinged: GET /' + req.params.shortUrl + ' from IP: ' + parseIp(req)
    );
    console.log('Redirecting to: ' + urlCheck.longUrl);

    if (urlCheck) {
      return res.redirect(urlCheck.longUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};

exports.getLinks = (req, res) => {
  const apiKey = req.query.APIKey;
  if (!apiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  UrlV2.find({ APIKey: apiKey })
    .then((url) => {
      res.json(url);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  parseIp(req);

  console.log('Pinged: GET /api/v2/links from IP: ' + parseIp(req));
};

exports.createLink = (req, res) => {
  let errors = [];
  let APIKey = req.query.APIKey;
  parseIp(req);

  console.log('Pinged: POST /api/v2/links/ from IP: ' + parseIp(req));

  // Check if long url exists
  if (!req.body.longUrl) {
    errors.push({
      text: 'Please add a long URL',
    });
  }
  // Check long url is valid
  if (!validTEMP.isUri(req.body.longUrl)) {
    errors.push({
      text: 'Invalid url',
    });
  }
  // Check if short url exists
  UrlV2.findOne({
    $and: [
      {
        shortUrl: req.body.shortUrl,
      },
      {
        APIKey: APIKey,
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
          expireAt: new Date(),
          createdAt: new Date(),
          APIKey: APIKey,
        };
        // Save url
        new UrlV2(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      } else {
        const newUrl = {
          longUrl: req.body.longUrl,
          shortUrl: req.body.shortUrl,
          expireAt: new Date(),
          createdAt: new Date(),
          APIKey: APIKey,
        };
        new UrlV2(newUrl).save().then((url) => {
          res.status(200).json(url);
        });
      }
    }
  });
};

exports.updateLink = (req, res) => {
  UrlV2.findById(req.params.id)
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
  UrlV2.findByIdAndRemove(req.params.id)
    .then((url) => {
      res.json(url + ' deleted');
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
