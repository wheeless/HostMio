var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
var shorten = require('./routes/shorten');
var apiv1 = require('./routes/api_v1');

var app = express();

// Connect to database
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiv1);
app.use('/', shorten);

module.exports = app;
