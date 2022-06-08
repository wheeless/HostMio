var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
const trebbleConnect = require('./middleware/trebble');
var cors = require('cors');
var queue = require('express-queue');
var app = express();
require('dotenv').config({ path: '.env' });
const { useTreblle } = require('treblle');
const env = process.env.NODE_ENV || 'development';
var morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const fs = require('fs');
const busboy = require('connect-busboy');
const rateLimit = require('express-rate-limit');
var MongoStore = require('rate-limit-mongo');
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

const limiter = rateLimit({
  store: new MongoStore({
    uri: `${process.env.MONGO_URI}`,
    // should match windowMs
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo'),
    // see Configuration section for more options and details
  }),
  windowMs: 60 * 60 * 1000, // 1 minute(s)
  max: 60, // Limit each IP to 60 requests per `window` (here, per 1 minute(s))
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

// Routes
const v1Route = require('./routes/v1Route');
const v2Route = require('./routes/v2Route');
const fileRoute = require('./routes/fileRoute');
const slackRoute = require('./routes/slackRoute');
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

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024, //5MB max file(s) size
    },
  })
);

app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
); // Insert the busboy middle-ware
app.use(limiter);
app.use(queue({ activeLimit: 5, queuedLimit: -1 }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Controller (route handlers).
app.post('/api/auth/signup', authController.signup);

// File Controller (route handlers).
app.route('/upload').post((req, res, next) => {
  const uploadPath = path.join(__dirname, './private/uploads/');
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on('file', (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);

    // Create a write stream of the new file
    const fstream = fs.createWriteStream(path.join(uploadPath, filename));
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on('close', () => {
      console.log(`Upload of '${filename}' finished`);
      res.redirect('back');
    });
  });
});

app.route('/uploadTest').get((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(
    '<form action="upload" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" name="fileToUpload"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end();
});
// app.post('/api/files/test/', fileHandler.uploadWithShortenedUrl);

// File Controller (route handlers).
app.use('/api/files', fileRoute);

// Links Controller (route handlers).
app.use('/api/v1/links', v1Route);

// Slack Controller (route handlers).
app.use('/api/slack', slackRoute);

// Links V2 Controller (route handlers).
app.use('/api/v2/links', v2Route);

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
