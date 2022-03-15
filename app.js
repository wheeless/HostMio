var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
var cors = require('cors');
var app = express();
require('dotenv').config({ path: '.env' });
const { useTreblle } = require('treblle');
const env = process.env.NODE_ENV || 'development';
var morgan = require('morgan');
const rfs = require('rotating-file-stream');
/**
 * Controllers (route handlers).
 */
const linksController = require('./controllers/links_v1');
const linksV2Controller = require('./controllers/links_v2');
const authController = require('./controllers/auth');

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
app.get('/api/v1/links/:shortUrl', cors(), linksController.getLink);

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Controller (route handlers).
app.post('/api/auth/signup', authController.signup);

// Controller v1 Routes
app.get('/api/v1/links', cors(), linksController.getLinks);
app.post('/api/v1/links', cors(), linksController.createLink);
app.delete('/api/v1/links/:id', linksController.deleteLink);
app.put('/api/v1/links/:id', linksController.updateLink);
// Controller v2 Routes
app.get('/api/v2/links', linksV2Controller.getLinks);
app.post('/api/v2/links', linksV2Controller.createLink);
app.delete('/api/v2/links/:id', linksV2Controller.deleteLink);
app.put('/api/v2/links/:id', linksV2Controller.updateLink);

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
  maxFiles: 14, // keep up to 4 rotated log files
  path: path.join(__dirname, 'logs'),
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

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

console.log('Launch Successful');

module.exports = app;
