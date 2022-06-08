var express = require('express');
var path = require('path');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const fs = require('fs');
const UploadedFiles = require('../models/uploadedFiles');
const busboy = require('connect-busboy');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.slackWebhook = async (req, res) => {
  let studentEmails = req.body.email.split(' ');
  console.log(studentEmails);
  let message = req.body.message;
  try {
    const uri = `${process.env.SLACK_WEBHOOK_URL}`;

    const emailLoop = async (studentEmails) => {
      for (let i = 0; i < studentEmails.length; i++) {
        await fetch(uri, {
          method: 'POST',
          body: JSON.stringify({
            email: studentEmails[i],
            message: message,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };
    emailLoop(studentEmails);
    console.log('Sent to Slack');
    return res.status(200).json('Success!');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};
