var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var dotenv = require('dotenv');

var router = express.Router();

router.get('/', function (req, res) {
  res.json(`I'm alive!`);
});

app.use(router);

exports.app = app;
