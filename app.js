var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
const trebbleConnect = require('./middleware/trebble');
var cors = require('cors');
var app = express();
require('dotenv').config({ path: '.env' });
const { useTreblle } = require('treblle');
const env = process.env.NODE_ENV || 'development';
var morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const fs = require('fs');
/**
 * Controllers (route handlers).
 */

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});

const pad = (num) => (num > 9 ? '' : '0') + num;
const generator = (index) => {
  let time = new Date();
  if (!time) return 'access.log';

  var month = time.getFullYear() + '-' + pad(time.getMonth() + 1);
  var day = pad(time.getDate());

  return `${month}-${day}-access.log`;
};

// create a rotating write stream
var accessLogStream = rfs.createStream(generator, {
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip', // compress rotated files
  maxFiles: 14, // keep up to 14 rotated log files
  path: path.join(__dirname, 'logs'),
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

const linksController = require('./controllers/links_v1');
const linksV2Controller = require('./controllers/links_v2');
const authController = require('./controllers/auth');
const fileHandler = require('./controllers/fileHandler');
const { nextTick } = require('process');

app.use(express.json());

// ATTACH TREBLLE WITH YOUR API KEY AND PROJECT ID
if (process.env.TREBLLE_APIKEY && process.env.TREBLLE_PROJECTID) {
  useTreblle(app, {
    apiKey: process.env.TREBLLE_APIKEY,
    projectId: process.env.TREBLLE_PROJECTID,
  });
} else {
  console.log(
    'No Treblle API Key found, remember to make sure you have a .env file with TREBLLE_APIKEY and TREBLLE_PROJECTID'
  );
  console.log('You can get an API key from https://treblle.com/');
}

// Prevent CORS errors

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 150 * 1024 * 1024 * 1024, //150MB max file(s) size
    },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Controller (route handlers).
app.post('/api/auth/signup', authController.signup);

// File Controller (route handlers).
app.get('/api/files/downloads/:fileName', fileHandler.downloadFileController);
app.post('/api/files/upload', fileHandler.upload);
app.get('/api/files/downloads/', fileHandler.showDownloads);
// app.post('/api/files/test/', fileHandler.uploadWithShortenedUrl);

// Controller v1 Routes
app.get('/api/v1/links', cors(), linksController.getLinks);
app.get('/api/v1/links/:shortUrl', cors(), linksController.getLink);
app.post('/api/v1/links', cors(), linksController.createLink);
app.delete('/api/v1/links/:id', cors(), linksController.deleteLink);
app.put('/api/v1/links/:id', cors(), linksController.updateLink);
app.patch(
  '/api/v1/links/:shortUrl/expire',
  cors(),
  linksController.updateExpireAt
);
app.get('/api/v1/links/:shortUrl/stats', cors(), linksController.getStats);
app.get(
  '/api/v1/links/:shortUrl/stats/:stat',
  cors(),
  linksController.getSpecificStats
);
app.patch(
  '/api/v1/links/:shortUrl/spend/:points',
  cors(),
  linksController.spendPoints
);
// Controller v2 Routes
app.get('/api/v2/links', linksV2Controller.getLinks);
app.post('/api/v2/links', linksV2Controller.createLink);
app.delete('/api/v2/links/:id', linksV2Controller.deleteLink);
app.put('/api/v2/links/:id', linksV2Controller.updateLink);

if (env === 'development') {
  app.use(cors());
} else if (env === 'production') {
  // Customize your cors options here
  // Edit your ALLOWED_ORIGINS in the .env file
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  const allowedOriginsArray = allowedOrigins
    .split(',')
    .map((item) => item.trim());
  console.log(allowedOriginsArray);
  var corsOptions = {
    origin: function (origin, callback) {
      if (allowedOriginsArray.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Where TF is your access token?'));
      }
    },
  };
  app.use(cors(corsOptions));
} else {
  console.log('Error: NODE_ENV not set to development or production');
  process.exit(1);
}
// End of cors customization section

connectDB()
  .then(() => {
    console.log('Connected to the database');
  })
  .then(() => {
    trebbleConnect(app);
  })
  .then(() => {
    console.log('Launch Successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

module.exports = app;
