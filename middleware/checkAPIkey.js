const UrlV2 = require('../models/UrlV2');
const Auth = require('../models/Auth');
const generateApiKey = require('generate-api-key');

exports.checkAPIkey = async (req, res, next) => {
  const { APIKey } = req.query.APIKey;
  const auth = await Auth.findOne({ APIKey });
  if (!auth) {
    return res.status(401).json({ message: 'This is not a valid api key!' });
  }
  next();
};
