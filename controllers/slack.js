var express = require('express');
var path = require('path');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const fs = require('fs');
const UploadedFiles = require('../models/uploadedFiles');
const busboy = require('connect-busboy');
const { Console } = require('console');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.slackWebhook = async (req, res) => {
  let studentEmails = req.body.email.split(' ');
  let message = req.body.message;
  let notifyBody = req.body.notify + ' kyle.wheeless@learningsource.com';
  let notify = notifyBody.split(' ');
  console.log(notify);
  let messageNotify = `The following students have received the message "${message}" from the Communication Bot: `;
  try {
    const uri = `${process.env.SLACK_WEBHOOK_URL}`;
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    let emailLoop = async (studentEmails) => {
      for (let i = 0; i < studentEmails.length; i++) {
        await sleep(1000);
        response = await fetch(uri, {
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
    // console.log(response);
    const notifyStaff = async (studentEmails, notify, message) => {
      for (let i = 0; i < notify.length; i++) {
        await fetch(uri, {
          method: 'POST',
          body: JSON.stringify({
            email: notify[i],
            message: messageNotify + studentEmails.join(', '),
          }),
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };
    notifyStaff(studentEmails, notify);
    console.log('Sent to Slack');
    return res.status(200).json('Success!');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};
