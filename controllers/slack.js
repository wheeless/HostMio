const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
var _ = require('lodash');

exports.slackWebhook = async (req, res) => {
  let studentEmails = req.body.email.split(' ');
  let message = req.body.message;
  let notifyBody = req.body.notify + ' kyle.wheeless@learningsource.com';
  let notify = notifyBody.split(' ');
  let webhookArray = [
    `${process.env.SLACK_WEBHOOK_URL}`,
    `${process.env.SLACK_WEBHOOK_URL2}`,
    `${process.env.SLACK_WEBHOOK_URL3}`,
  ];
  let messageNotify = `The following students have received the message "${message}" from the Communication Bot: `;
  try {
    const uri = _.sample(webhookArray);
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
      notifyStaff(studentEmails, notify);
    };
    emailLoop(studentEmails);
    const notifyStaff = async (studentEmails, notify) => {
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
    return res.status(200).json('Success!');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};
