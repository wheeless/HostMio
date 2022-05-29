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
        clicks: 1,
        points: 1,
      }
    );
    const parseIp = (req) =>
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    if (url !== null) {
      console.log(
        'Pinged: GET /' + req.params.shortUrl + ' from IP: ' + parseIp(req)
      );
      await url.clicks++;
      url.points = url.points + 25;
      await url.save();
      return await res.json(url);
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

// exports.getClicks = async (req, res) => {
//   try {
//     const url = await Url.findOne(
//       { shortUrl: req.params.shortUrl },
//       {
//         shortUrl: 1,
//         clicks: 1,
//       }
//     );
//     const parseIp = (req) =>
//       req.headers['x-forwarded-for']?.split(',').shift() ||
//       req.socket?.remoteAddress;

//     if (url !== null) {
//       console.log(
//         'Pinged: GET /' +
//           req.params.shortUrl +
//           '/clicks from IP: ' +
//           parseIp(req)
//       );
//       return res.json(url);
//     } else {
//       console.log(
//         'Pinged: GET /' +
//           req.params.shortUrl +
//           ' from IP: ' +
//           parseIp(req) +
//           ' but no short url found.'
//       );
//       res.status(404).json({ message: 'No short url found' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json('Server Error');
//   }
// };

exports.getStats = async (req, res) => {
  try {
    const url = await Url.findOne(
      { shortUrl: req.params.shortUrl },
      {
        shortUrl: 1,
        longUrl: 1,
        expireAt: 1,
        clicks: 1,
        points: 1,
        date: 1,
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
          '/stats from IP: ' +
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

exports.getSpecificStats = async (req, res) => {
  try {
    const url = await Url.findOne(
      { shortUrl: req.params.shortUrl },
      {
        shortUrl: 1,
        longUrl: 1,
        expireAt: 1,
        clicks: 1,
        points: 1,
        date: 1,
        clicks: 1,
      }
    );
    const parseIp = (req) =>
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress;

    if (url !== null) {
      switch (req.params.stat) {
        case 'longUrl':
          res.json([url.shortUrl, url.longUrl]);
          break;
        case 'clicks':
          res.json([url.shortUrl, url.clicks]);
          break;
        case 'points':
          res.json([url.shortUrl, url.points]);
          break;
        case 'date':
          res.json([url.shortUrl, url.date]);
          break;
        case 'expireAt':
          res.json([url.shortUrl, url.expireAt]);
          break;
        default:
          res.status(400).json({ message: 'No stat by that name found', url });
      }
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

  // Check if short url is being set
  if (req.body.shortUrl) {
    shortUrlVar = req.body.shortUrl;
  } else {
    shortUrlVar = shortid.generate();
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
      } else {
        // If no errors
        const newUrl = {
          // Create new url
          longUrl: req.body.longUrl, // Long url
          shortUrl: shortUrlVar, // Short url
          date: new Date(), // Date
          expireAt: req.body.expireAt, // Expire at
        };
        new Url(newUrl).save().then((url) => {
          res.status(200).json(url);
        }); // Save new url
      } // end else
    } // end else
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
    'Pinged: PATCH /api/v1/links/' +
      req.params.shortUrl +
      '/expire from IP: ' +
      parseIp(req)
  );

  Url.findOne({
    shortUrl: req.params.shortUrl,
  })
    .then((url) => {
      if (url) {
        if (url.expireRefresh) {
          res.status(403).json({
            message:
              'Expire date already refreshed. Please use points to extend the time.',
          });
        } else {
          if (!req.body.expireAt) {
            url.expireAt = +new Date(url.expireAt) + 30 * 24 * 60 * 60 * 1000;
          } else {
            url.expireAt = req.body.expireAt;
          }
          // url.expireRefresh = true;
          url.save().then((url) => {
            res.status(200).json(url);
          });
        }
      } else {
        res.status(404).json({ message: 'No short url found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.spendPoints = async (req, res) => {
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress;

  console.log(
    'Pinged: PATCH /api/v1/links/' +
      req.params.shortUrl +
      '/spend/' +
      req.params.points +
      ' from IP: ' +
      parseIp(req)
  );

  Url.findOne({
    shortUrl: req.params.shortUrl,
  })
    .then((url) => {
      if (url) {
        if (99 > url.points) {
          res.status(400).json({
            message:
              'Not enough points, this link does not have ' +
              req.param.points +
              ' points. Only ' +
              url.points +
              ' points available.',
          });
        } else {
          url.points = url.points - req.params.points;
          url.expireAt =
            +new Date(url.expireAt) + req.params.points * 60 * 60 * 1000;
          url.save().then((url) => {
            res.status(200).json(url);
          });
        }
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
