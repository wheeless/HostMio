var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
var shorten = require('./routes/shorten');
var apiv1 = require('./routes/api_v1');
var cors = require('cors');
var app = express();
require('dotenv').config();
const { useTreblle } = require('treblle');

// controllers
const linksController = require('./controllers/links_v1');

app.use(express.json());

// ATTACH TREBLLE WITH YOUR API KEY AND PROJECT ID
useTreblle(app, {
  apiKey: process.env.apiKey,
  projectId: process.env.projectId,
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

app.get('/api/v1/links/:shortUrl', linksController.getLink);
app.get('/api/v1/links', linksController.getLinks);
app.post('/api/v1/links', linksController.createLink);
app.delete('/api/v1/links/:id', linksController.deleteLink);
app.put('/api/v1/links/:id', linksController.updateLink);

//app.use('/api/v1', apiv1);
//app.use('/', shorten);
console.log('Launch Successful');
module.exports = app;
