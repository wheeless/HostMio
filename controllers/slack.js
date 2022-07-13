const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
var _ = require('lodash');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log();
exports.slackWebhook = async (req, res) => {
  switch (req.body.sender) {
    case 'Josh':
      var sender = 'joshua.butler@learningsource.com';
      var emailSignature =
        'Joshua Butler <span style="color:#27ABE3">|</span> Senior Mentor';
      var emailContact = `<span style="color:#27ABE3">T:</span> 512.770.9459 <span style="color:#27ABE3">E:</span> ${sender}`;
      break;
    case 'Kyle':
      var sender = 'kyle.wheeless@learningsource.com';
      var emailSignature =
        'Kyle Wheeless <span style="color:#27ABE3">|</span> Senior Mentor';
      var emailContact = `<span style="color:#27ABE3">T:</span> 512.438.1910 <span style="color:#27ABE3">E:</span> ${sender}`;
      break;
    default:
      var sender = 'kyle.wheeless@learningsource.com';
  }
  let studentEmails = req.body.email.split(' ');
  // let message = req.body.message;
  let messageSignature = req.body.signature;
  if (messageSignature) {
    messageSignature = ' - ' + req.body.signature + ', at Learning Source';
  } else {
    messageSignature = ' - Learning Source Education';
  }
  switch (req.body.message) {
    case 'LDA':
      switch (req.body.daysLDA) {
        case '3':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are three days out of attendances. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '4':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are four days out of attendances. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '5':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently, you are not meeting the attendance policy and are five days out of attendance. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding, and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '6':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are six days out of attendances. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '7':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are seven days out of attendances and run the risk of being removed from the program after ten days. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '8':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are eight days out of attendances and run the risk of being removed from the program after ten days. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '9':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are nine days out of attendances and run the risk of being removed from the program after ten days. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        case '10':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting attendance policy and are ten days out of attendances, today is your last day to access your course before being removed from the program. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        default:
          message =
            'Hello there! We are reaching out regarding your attendance. Currently, you are not meeting the attendance policy. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding, and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
      }
      break;
    case 'Behind':
      message =
        'Hello there! We are reaching out regarding your coursework. We noticed you are a bit behind in your course and we are concerned as the further you fall behind, the harder it will become to get caught back up. Please make sure to be communicating with us and to be progressing in your coursework DAILY. If you are needing help please utilize your mentor, program channel and workshops found here: https://vimeo.com/thewozu/albums | if you cannot find a workshop that works for you please let a mentor know asap so we can find one that will work for your needs. Please remember, no late finals will be accepted past the Sunday night deadline unless prior arrangements have been made and approved by your Instructor/Senior Mentor, or other extenuating circumstances apply. Thanks, you got this!';
      break;
    case 'LDABehind':
      message =
        'Hello there! We are reaching out regarding your coursework. We noticed you are a bit behind in your course and not making attendance, we are concerned as the further you fall behind, the harder it will become to get caught back up. Please make sure to be communicating with us and to be progressing in your coursework DAILY. If you are needing help please utilize your mentor, program channel and workshops found here: https://vimeo.com/thewozu/albums | if you cannot find a workshop that works for you please let a mentor know asap so we can find one that will work for your needs. Please remember, no late finals will be accepted past the Sunday night deadline unless prior arrangements have been made and approved by your Instructor/Senior Mentor, or other extenuating circumstances apply. Make sure to be spending at least 20 hours a week in your course to make attendance, if you need help setting up a coursework schedule please let your mentor know. Thanks, you got this!';
    case 'CommunicationIssues':
      message =
        'Hello there! I hope all is well. We are reaching out regarding your communication. Communication is the key to success. We would like to touch base and see how we can be of better support to help you reach your goal. Is there a good time for us to chat?';
      break;
    case 'NoComms':
      message =
        'Hello there! We are concerned about you and your success in your current course. We have not heard from you recently and would like to ensure you are okay. Please respond at your earliest convenience. We would like to see how you are and help to set a game plan to place you back on track in your course. We are here to support you and to see you reach your goals. Hope to hear from you soon! ';
      break;
    default:
      message = req.body.message;
      break;
  }
  switch (req.body.team) {
    case 'SWD':
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'DSO':
      notifyBody =
        'nolan.hardeman@learningsource.com margaret.martinez@learningsource.com milton.gerardino@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'CSO':
      notifyBody =
        'shaun.manzano@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'MDO':
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'UAT':
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com';
      ' ' + req.body.notify;
      break;
    default:
      notifyBody = req.body.notify + ' kyle.wheeless@learningsource.com';
      break;
  }
  let messageCombine = message + messageSignature;
  let notify = notifyBody.split(' ');

  if (req.body.team) {
    teamMessage = `Hello ${req.body.team} management member! `;
  } else {
    teamMessage = '';
  }
  let messageNotify = `${teamMessage}The following students have received the message "${messageCombine}" from the Communication Bot: `;
  let webhookArray = [
    `${process.env.SLACK_WEBHOOK_URL}`,
    `${process.env.SLACK_WEBHOOK_URL2}`,
    `${process.env.SLACK_WEBHOOK_URL3}`,
  ];
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
            message: messageCombine,
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
    const msg = {
      to: 'kyle.wheeless@scitexas.edu', // Change to your recipient
      from: sender, // Change to your verified sender
      subject: req.body.subject,
      cc: notifyBody,
      bcc: studentEmails,
      html: `<p>${message}</p><br><p><img src="https://api.avernix.com/api/files/downloads/94dacf92-3a76-45ac-a007-16efaa80b622-Outlook-14n4hiys.png"> <br> <img src="https://api.avernix.com/api/files/downloads/8c694a99-82b0-4637-b304-05f10411f05c-Outlook-vic154nn.png"> <br> ${emailSignature}<br>1701 Directors Blvd <span style="color:#27ABE3">|</span>  Suite 800 <span style="color:#27ABE3">|</span>  Austin, TX 78744<br>${emailContact}</p>`,
    };
    (async () => {
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();
    return res.status(200).json('Success!');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};
