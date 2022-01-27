var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
var cors = require('cors');
var app = express();
require('dotenv').config();
const { useTreblle } = require('treblle');

// Controllers
const linksController = require('./controllers/links_v1');

app.use(express.json());

// ATTACH TREBLLE WITH YOUR API KEY AND PROJECT ID
useTreblle(app, {
  apiKey: process.env.TREBLLE_apiKey,
  projectId: process.env.TREBLLE_projectId,
});

// Customize your cors options here
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
// End of cors customization section

// Connect to database
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Controller Routes
app.get('/api/v1/links/:shortUrl', linksController.getLink);
app.get('/api/v1/links', linksController.getLinks);
app.post('/api/v1/links', linksController.createLink);
app.delete('/api/v1/links/:id', linksController.deleteLink);
app.put('/api/v1/links/:id', linksController.updateLink);

console.log('Launch Successful');
module.exports = app;
