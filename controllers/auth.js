const Auth = require('../models/Auth');
const generateApiKey = require('generate-api-key');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const apiKey = generateApiKey({
    name: 'myKeyForHostMio',
    method: 'uuidv4',
    dashes: false,
  });
  const auth = new Auth({
    username,
    email,
    password,
    APIKey: apiKey,
  });
  try {
    const newAuth = await auth.save();
    res.json(newAuth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.regenerateApiKey = async (req, res) => {
  const { username } = req.body;
  const apiKey = generateApiKey({
    method: 'string',
    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  });
  try {
    const auth = await Auth.findOneAndUpdate({ username }, { APIKey: apiKey });
    res.json(auth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
