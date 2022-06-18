const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');
// use $ and @ instead of - and _
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
);

const myCustomLabels = {
  docs: 'urls',
};

const options = {
  sort: { date: -1 },
  pagination: true,
  customLabels: myCustomLabels,
  collation: {
    locale: 'en',
  },
};

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

    if (url !== null) {
      return res.json(url);
    } else {
      res.status(404).json({ message: 'No short url found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.incrementClicks = async (req, res) => {
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

    if (url !== null) {
      await url.clicks++;
      url.points = url.points + 25;
      await url.save();
      return await res.json(url);
    } else {
      res.status(404).json({ message: 'No short url found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

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

    if (url !== null) {
      return res.json(url);
    } else {
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
      res.status(404).json({ message: 'No short url found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.getLinks = (req, res) => {
  // var findAll = Url.find();

  // Url.paginate(
  //   findAll,
  //   { page: req.query.page || 1, limit: req.query.limit || 1000, options },
  //   function (err, result) {
  //     if (err) {
  //       return res.status(500).json({ message: err.message });
  //     } else {
  //       return res.json(result);
  //     }
  //   }
  // );
  Url.find()
    .then((url) => {
      res.json(url);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.createLink = (req, res) => {
  let errors = [];

  // Check if long url exists
  if (!req.body.longUrl) {
    errors.push({
      text: 'Please add a long URL',
    });
    res.status(400).json(errors);
  }

  // Check long url is valid
  if (!validUrl.isUri(req.body.longUrl)) {
    errors.push({
      text: 'Invalid url',
    });
    res.status(400).json(errors);
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
              ' points. There is only ' +
              url.points +
              ' point(s) available.',
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
