const Auth = require('../models/Auth');
const generateApiKey = require('generate-api-key');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const apiKey = generateApiKey({
    method: 'uuidv5',
    name: 'HostMio API Key',
    prefix: 'HM',
    dashes: false,
    batch: 1,
  });
  const apiKey2 = generateApiKey({
    method: 'uuidv5',
    name: 'HostMio API Key Number 2',
    dashes: false,
    batch: 1,
  });

  const fullApiKey = apiKey + '.' + apiKey2;

  const auth = new Auth({
    username,
    email,
    password,
    APIKey: fullApiKey,
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
    method: 'uuidv5',
    name: 'HostMio API Key',
    prefix: 'HM',
    dashes: false,
    batch: 1,
  });
  try {
    const auth = await Auth.findOneAndUpdate({ username }, { APIKey: apiKey });
    res.json(auth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApiKey = async (req, res) => {
  const username = req.body.username;
  try {
    const auth = await Auth.findOne({ username });
    const apiKey = generateApiKey({
      method: 'uuidv5',
      name: 'HostMio API Key',
      prefix: 'HM',
      dashes: false,
      batch: 1,
    });
    const apiKey2 = generateApiKey({
      method: 'uuidv5',
      name: 'HostMio API Key Number 2',
      dashes: false,
      batch: 1,
    });

    const fullApiKey = apiKey + '.' + apiKey2;

    res.json(fullApiKey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
