var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
var shorten = require('./routes/shorten');
var apiv1 = require('./routes/api_v1');
var cors = require('cors');
var app = express();

var whitelist = [
  'https://wheeless.dev',
  'https://hostm.io',
  'https://api.hostmonkey.io',
  'https://hostm.io/urls',
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Where TF is your api access token?'));
    }
  },
};

app.use(cors());

// Connect to database
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiv1);
app.use('/', shorten);
console.log('Launch Successful');
module.exports = app;
